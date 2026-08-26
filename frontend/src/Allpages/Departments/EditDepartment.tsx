import { useState, type FormEvent } from "react";
import { updateDepartment, type Department } from "./api";

interface Props {
  department: Department;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function EditDepartment({ department, onSuccess, onCancel }: Props) {
  const [name, setName] = useState(department.name);
  const [description, setDescription] = useState(department.description ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await updateDepartment(department.id!, { name, description });
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to update department");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="admin-form-error">{error}</div>}
      <div className="admin-form-field">
        <label htmlFor="edit-dept-name">Name</label>
        <input id="edit-dept-name" value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
      </div>
      <div className="admin-form-field">
        <label htmlFor="edit-dept-description">Description</label>
        <textarea id="edit-dept-description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className="admin-form-actions">
        <button type="button" className="admin-btn admin-btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="admin-btn" disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
