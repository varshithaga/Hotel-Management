import { useState, type FormEvent } from "react";
import { updateStaffRole, type StaffRole } from "./api";

interface Props {
  staffRole: StaffRole;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function EditStaffRole({ staffRole, onSuccess, onCancel }: Props) {
  const [name, setName] = useState(staffRole.name);
  const [description, setDescription] = useState(staffRole.description ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await updateStaffRole(staffRole.id!, { name, description });
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to update staff role");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="admin-form-error">{error}</div>}
      <div className="admin-form-field">
        <label htmlFor="edit-sr-name">Name</label>
        <input id="edit-sr-name" value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
      </div>
      <div className="admin-form-field">
        <label htmlFor="edit-sr-description">Description</label>
        <textarea id="edit-sr-description" value={description} onChange={(e) => setDescription(e.target.value)} />
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
