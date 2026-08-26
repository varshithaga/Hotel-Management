import { useState, type FormEvent } from "react";
import { updateContact, type ContactForm } from "./api";

interface Props {
  contact: ContactForm;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function EditContact({ contact, onSuccess, onCancel }: Props) {
  const [callStatus, setCallStatus] = useState(contact.call_status ?? "not_called");
  const [answerStatus, setAnswerStatus] = useState(contact.answer_status ?? "not_answered");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await updateContact(contact.id!, { call_status: callStatus, answer_status: answerStatus });
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to update contact form entry");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="admin-form-error">{error}</div>}
      <p style={{ marginTop: 0, color: "#6b7280", fontSize: 13 }}>
        <strong>{contact.name}</strong> ({contact.email}) — {contact.subject}
        <br />
        {contact.message}
      </p>
      <div className="admin-form-field">
        <label htmlFor="edit-ct-call">Call Status</label>
        <select
          id="edit-ct-call"
          value={callStatus}
          onChange={(e) => setCallStatus(e.target.value as NonNullable<ContactForm["call_status"]>)}
        >
          <option value="not_called">Not Called</option>
          <option value="called">Called</option>
        </select>
      </div>
      <div className="admin-form-field">
        <label htmlFor="edit-ct-answer">Answer Status</label>
        <select
          id="edit-ct-answer"
          value={answerStatus}
          onChange={(e) => setAnswerStatus(e.target.value as NonNullable<ContactForm["answer_status"]>)}
        >
          <option value="not_answered">Not Answered</option>
          <option value="answered">Answered</option>
        </select>
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
