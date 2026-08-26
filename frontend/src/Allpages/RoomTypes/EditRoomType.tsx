import { useState, type FormEvent } from "react";
import { updateRoomType, type RoomType } from "./api";

interface Props {
  roomType: RoomType;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function EditRoomType({ roomType, onSuccess, onCancel }: Props) {
  const [name, setName] = useState(roomType.name);
  const [description, setDescription] = useState(roomType.description ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await updateRoomType(roomType.id!, { name, description });
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to update room type");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="admin-form-error">{error}</div>}
      <div className="admin-form-field">
        <label htmlFor="edit-rt-name">Name</label>
        <input id="edit-rt-name" value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
      </div>
      <div className="admin-form-field">
        <label htmlFor="edit-rt-description">Description</label>
        <textarea id="edit-rt-description" value={description} onChange={(e) => setDescription(e.target.value)} />
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
