import { useState, type FormEvent } from "react";
import { updateUser, type User } from "./api";

interface Props {
  user: User;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function EditUser({ user, onSuccess, onCancel }: Props) {
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [fullName, setFullName] = useState(user.full_name);
  const [role, setRole] = useState<User["role"]>(user.role);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload: Partial<User> = { username, email, full_name: fullName, role };
      if (password) payload.password = password;
      await updateUser(user.id!, payload);
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="admin-form-error">{error}</div>}
      <div className="admin-form-field">
        <label htmlFor="edit-usr-username">Username</label>
        <input id="edit-usr-username" value={username} onChange={(e) => setUsername(e.target.value)} required />
      </div>
      <div className="admin-form-field">
        <label htmlFor="edit-usr-email">Email</label>
        <input id="edit-usr-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="admin-form-field">
        <label htmlFor="edit-usr-fullname">Full Name</label>
        <input id="edit-usr-fullname" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
      </div>
      <div className="admin-form-field">
        <label htmlFor="edit-usr-role">Role</label>
        <select id="edit-usr-role" value={role} onChange={(e) => setRole(e.target.value as User["role"])}>
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div className="admin-form-field">
        <label htmlFor="edit-usr-password">New Password (optional)</label>
        <input
          id="edit-usr-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Leave blank to keep current password"
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
