import { useState, type FormEvent } from "react";
import { createUser, type User } from "./api";

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AddUser({ onSuccess, onCancel }: Props) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<User["role"]>("staff");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await createUser({ username, email, full_name: fullName, role, password });
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to create user");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="admin-form-error">{error}</div>}
      <div className="admin-form-field">
        <label htmlFor="usr-username">Username</label>
        <input id="usr-username" value={username} onChange={(e) => setUsername(e.target.value)} required />
      </div>
      <div className="admin-form-field">
        <label htmlFor="usr-email">Email</label>
        <input id="usr-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="admin-form-field">
        <label htmlFor="usr-fullname">Full Name</label>
        <input id="usr-fullname" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
      </div>
      <div className="admin-form-field">
        <label htmlFor="usr-role">Role</label>
        <select id="usr-role" value={role} onChange={(e) => setRole(e.target.value as User["role"])}>
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div className="admin-form-field">
        <label htmlFor="usr-password">Password</label>
        <input id="usr-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
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
