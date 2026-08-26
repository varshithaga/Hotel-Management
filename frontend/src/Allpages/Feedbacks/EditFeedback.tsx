import { useState, type FormEvent } from "react";
import { updateFeedback, type Feedback } from "./api";

interface Props {
  feedback: Feedback;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function EditFeedback({ feedback, onSuccess, onCancel }: Props) {
  const [name, setName] = useState(feedback.name);
  const [email, setEmail] = useState(feedback.email);
  const [subject, setSubject] = useState(feedback.subject);
  const [message, setMessage] = useState(feedback.message);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await updateFeedback(feedback.id!, { name, email, subject, message });
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to update feedback");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="admin-form-error">{error}</div>}
      <div className="admin-form-field">
        <label htmlFor="edit-fb-name">Name</label>
        <input id="edit-fb-name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="admin-form-field">
        <label htmlFor="edit-fb-email">Email</label>
        <input id="edit-fb-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="admin-form-field">
        <label htmlFor="edit-fb-subject">Subject</label>
        <input id="edit-fb-subject" value={subject} onChange={(e) => setSubject(e.target.value)} required />
      </div>
      <div className="admin-form-field">
        <label htmlFor="edit-fb-message">Message</label>
        <textarea id="edit-fb-message" value={message} onChange={(e) => setMessage(e.target.value)} required />
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
