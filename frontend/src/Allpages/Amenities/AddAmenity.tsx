import { useState, type FormEvent } from "react";
import { createAmenity } from "./api";

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AddAmenity({ onSuccess, onCancel }: Props) {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await createAmenity({ name, icon });
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to create amenity");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="admin-form-error">{error}</div>}
      <div className="admin-form-field">
        <label htmlFor="am-name">Name</label>
        <input id="am-name" value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
      </div>
      <div className="admin-form-field">
        <label htmlFor="am-icon">Icon</label>
        <input id="am-icon" value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="e.g. wifi" />
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
