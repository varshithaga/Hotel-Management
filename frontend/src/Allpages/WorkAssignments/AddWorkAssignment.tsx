import { useEffect, useState, type FormEvent } from "react";
import { createWorkAssignment, type WorkAssignment } from "./api";
import { getWorkTypeList, type WorkType } from "../WorkTypes/api";
import { getEmployeeList, type Employee } from "../Employees/api";
import { getRoomList, type Room } from "../Rooms/api";

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AddWorkAssignment({ onSuccess, onCancel }: Props) {
  const [workTypes, setWorkTypes] = useState<WorkType[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [workTypeId, setWorkTypeId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState<NonNullable<WorkAssignment["status"]>>("not_started");
  const [employeeIds, setEmployeeIds] = useState<string[]>([]);
  const [roomIds, setRoomIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getWorkTypeList(1, "all").then((res) => setWorkTypes(res.results));
    getEmployeeList(1, "all").then((res) => setEmployees(res.results));
    getRoomList(1, "all").then((res) => setRooms(res.results));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await createWorkAssignment({
        work_type_id: Number(workTypeId),
        start_date: startDate,
        end_date: endDate || undefined,
        status,
        employee_ids: employeeIds.map(Number),
        room_ids: roomIds.map(Number),
      });
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to create work assignment");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="admin-form-error">{error}</div>}
      <div className="admin-form-field">
        <label htmlFor="wa-worktype">Work Type</label>
        <select id="wa-worktype" value={workTypeId} onChange={(e) => setWorkTypeId(e.target.value)} required>
          <option value="">Select work type</option>
          {workTypes.map((wt) => (
            <option key={wt.id} value={wt.id}>
              {wt.name}
            </option>
          ))}
        </select>
      </div>
      <div className="admin-form-field">
        <label htmlFor="wa-start">Start Date</label>
        <input id="wa-start" type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
      </div>
      <div className="admin-form-field">
        <label htmlFor="wa-end">End Date</label>
        <input id="wa-end" type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </div>
      <div className="admin-form-field">
        <label htmlFor="wa-status">Status</label>
        <select id="wa-status" value={status} onChange={(e) => setStatus(e.target.value as NonNullable<WorkAssignment["status"]>)}>
          <option value="not_started">Not Started</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <div className="admin-form-field">
        <label htmlFor="wa-employees">Employees</label>
        <select
          id="wa-employees"
          multiple
          value={employeeIds}
          onChange={(e) => setEmployeeIds(Array.from(e.target.selectedOptions, (o) => o.value))}
        >
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.name}
            </option>
          ))}
        </select>
      </div>
      <div className="admin-form-field">
        <label htmlFor="wa-rooms">Rooms</label>
        <select
          id="wa-rooms"
          multiple
          value={roomIds}
          onChange={(e) => setRoomIds(Array.from(e.target.selectedOptions, (o) => o.value))}
        >
          {rooms.map((r) => (
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
