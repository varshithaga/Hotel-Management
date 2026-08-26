import { useState, type FormEvent } from "react";
import { updateAmenity, type Amenity } from "./api";

interface Props {
  amenity: Amenity;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function EditAmenity({ amenity, onSuccess, onCancel }: Props) {
  const [name, setName] = useState(amenity.name);
  const [icon, setIcon] = useState(amenity.icon ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await updateAmenity(amenity.id!, { name, icon });
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to update amenity");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="admin-form-error">{error}</div>}
      <div className="admin-form-field">
        <label htmlFor="edit-am-name">Name</label>
        <input id="edit-am-name" value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
      </div>
      <div className="admin-form-field">
        <label htmlFor="edit-am-icon">Icon</label>
        <input id="edit-am-icon" value={icon} onChange={(e) => setIcon(e.target.value)} />
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
