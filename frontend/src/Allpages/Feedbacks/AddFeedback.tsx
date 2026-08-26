import { useState, type FormEvent } from "react";
import { createFeedback } from "./api";

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AddFeedback({ onSuccess, onCancel }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await createFeedback({ name, email, subject, message });
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to create feedback");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="admin-form-error">{error}</div>}
      <div className="admin-form-field">
        <label htmlFor="fb-name">Name</label>
        <input id="fb-name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="admin-form-field">
        <label htmlFor="fb-email">Email</label>
        <input id="fb-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="admin-form-field">
        <label htmlFor="fb-subject">Subject</label>
        <input id="fb-subject" value={subject} onChange={(e) => setSubject(e.target.value)} required />
      </div>
      <div className="admin-form-field">
        <label htmlFor="fb-message">Message</label>
        <textarea id="fb-message" value={message} onChange={(e) => setMessage(e.target.value)} required />
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
