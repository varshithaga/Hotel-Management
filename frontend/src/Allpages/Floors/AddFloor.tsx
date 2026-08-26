import { useState, type FormEvent } from "react";
import { createFloor } from "./api";

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AddFloor({ onSuccess, onCancel }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await createFloor({ name, description });
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to create floor");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="admin-form-error">{error}</div>}
      <div className="admin-form-field">
        <label htmlFor="floor-name">Name</label>
        <input id="floor-name" value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
      </div>
      <div className="admin-form-field">
        <label htmlFor="floor-description">Description</label>
        <textarea id="floor-description" value={description} onChange={(e) => setDescription(e.target.value)} />
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
