import { useState, type FormEvent } from "react";
import { updateWorkType, type WorkType } from "./api";

interface Props {
  workType: WorkType;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function EditWorkType({ workType, onSuccess, onCancel }: Props) {
  const [name, setName] = useState(workType.name);
  const [description, setDescription] = useState(workType.description ?? "");
  const [isActive, setIsActive] = useState(workType.is_active ?? true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await updateWorkType(workType.id!, { name, description, is_active: isActive });
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to update work type");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="admin-form-error">{error}</div>}
      <div className="admin-form-field">
        <label htmlFor="edit-wt-name">Name</label>
        <input id="edit-wt-name" value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
      </div>
      <div className="admin-form-field">
        <label htmlFor="edit-wt-description">Description</label>
        <textarea id="edit-wt-description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className="admin-form-field admin-form-field-checkbox">
        <input id="edit-wt-active" type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
        <label htmlFor="edit-wt-active">Active</label>
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
