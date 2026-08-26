import { useEffect, useState, type FormEvent } from "react";
import { updateEmployee, type Employee } from "./api";
import { getDepartmentList, type Department } from "../Departments/api";
import { getStaffRoleList, type StaffRole } from "../StaffRoles/api";

interface Props {
  employee: Employee;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function EditEmployee({ employee, onSuccess, onCancel }: Props) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [staffRoles, setStaffRoles] = useState<StaffRole[]>([]);
  const [name, setName] = useState(employee.name);
  const [email, setEmail] = useState(employee.email);
  const [phone, setPhone] = useState(employee.phone);
  const [departmentId, setDepartmentId] = useState(String(employee.department_id));
  const [roleId, setRoleId] = useState(String(employee.role_id));
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
      await updateEmployee(employee.id!, {
        name,
        email,
        phone,
        department_id: Number(departmentId),
        role_id: Number(roleId),
      });
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to update employee");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="admin-form-error">{error}</div>}
      <div className="admin-form-field">
        <label htmlFor="edit-emp-name">Name</label>
        <input id="edit-emp-name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="admin-form-field">
        <label htmlFor="edit-emp-email">Email</label>
        <input id="edit-emp-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="admin-form-field">
        <label htmlFor="edit-emp-phone">Phone</label>
        <input id="edit-emp-phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
      </div>
      <div className="admin-form-field">
        <label htmlFor="edit-emp-department">Department</label>
        <select id="edit-emp-department" value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} required>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>
      <div className="admin-form-field">
        <label htmlFor="edit-emp-role">Role</label>
        <select id="edit-emp-role" value={roleId} onChange={(e) => setRoleId(e.target.value)} required>
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
