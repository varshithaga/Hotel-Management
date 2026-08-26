import { useState, type FormEvent } from "react";
import { createWorkType } from "./api";

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AddWorkType({ onSuccess, onCancel }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await createWorkType({ name, description, is_active: isActive });
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to create work type");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="admin-form-error">{error}</div>}
      <div className="admin-form-field">
        <label htmlFor="wt-name">Name</label>
        <input id="wt-name" value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
      </div>
      <div className="admin-form-field">
        <label htmlFor="wt-description">Description</label>
        <textarea id="wt-description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className="admin-form-field admin-form-field-checkbox">
        <input id="wt-active" type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
        <label htmlFor="wt-active">Active</label>
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
