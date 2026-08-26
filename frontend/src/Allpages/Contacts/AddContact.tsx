import { useState, type FormEvent } from "react";
import { createContact } from "./api";

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AddContact({ onSuccess, onCancel }: Props) {
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
      await createContact({ name, email, subject, message });
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to create contact form entry");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="admin-form-error">{error}</div>}
      <div className="admin-form-field">
        <label htmlFor="ct-name">Name</label>
        <input id="ct-name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="admin-form-field">
        <label htmlFor="ct-email">Email</label>
        <input id="ct-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="admin-form-field">
        <label htmlFor="ct-subject">Subject</label>
        <input id="ct-subject" value={subject} onChange={(e) => setSubject(e.target.value)} required />
      </div>
      <div className="admin-form-field">
        <label htmlFor="ct-message">Message</label>
        <textarea id="ct-message" value={message} onChange={(e) => setMessage(e.target.value)} required />
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
