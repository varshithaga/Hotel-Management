import { useEffect, useState, type FormEvent } from "react";
import { createEmployee } from "./api";
import { getDepartmentList, type Department } from "../Departments/api";
import { getStaffRoleList, type StaffRole } from "../StaffRoles/api";

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AddEmployee({ onSuccess, onCancel }: Props) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [staffRoles, setStaffRoles] = useState<StaffRole[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [roleId, setRoleId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getDepartmentList(1, "all").then((res) => setDepartments(res.results));
    getStaffRoleList(1, "all").then((res) => setStaffRoles(res.results));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await createEmployee({
        name,
        email,
        phone,
        department_id: Number(departmentId),
        role_id: Number(roleId),
      });
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to create employee");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="admin-form-error">{error}</div>}
      <div className="admin-form-field">
        <label htmlFor="emp-name">Name</label>
        <input id="emp-name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="admin-form-field">
        <label htmlFor="emp-email">Email</label>
        <input id="emp-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="admin-form-field">
        <label htmlFor="emp-phone">Phone</label>
        <input id="emp-phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
      </div>
      <div className="admin-form-field">
        <label htmlFor="emp-department">Department</label>
        <select id="emp-department" value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} required>
          <option value="">Select department</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>
      <div className="admin-form-field">
        <label htmlFor="emp-role">Role</label>
        <select id="emp-role" value={roleId} onChange={(e) => setRoleId(e.target.value)} required>
          <option value="">Select role</option>
          {staffRoles.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
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
