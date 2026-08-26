import { useState, type FormEvent } from "react";
import { updateFloor, type Floor } from "./api";

interface Props {
  floor: Floor;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function EditFloor({ floor, onSuccess, onCancel }: Props) {
  const [name, setName] = useState(floor.name);
  const [description, setDescription] = useState(floor.description ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await updateFloor(floor.id!, { name, description });
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to update floor");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="admin-form-error">{error}</div>}
      <div className="admin-form-field">
        <label htmlFor="edit-floor-name">Name</label>
        <input id="edit-floor-name" value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
      </div>
      <div className="admin-form-field">
        <label htmlFor="edit-floor-description">Description</label>
        <textarea
          id="edit-floor-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
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
