import { useCallback, useEffect, useState } from "react";
import DataTable, { type Column } from "../components/DataTable";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import Modal from "../components/Modal";
import AddEmployee from "./AddEmployee";
import EditEmployee from "./EditEmployee";
import { deleteEmployee, getEmployeeList, type Employee, type PaginatedResponses } from "./api";

export default function EmployeesPage() {
  const [data, setData] = useState<PaginatedResponses<Employee> | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getEmployeeList(page, 10, search);
      setData(res);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const handleDelete = async (row: Employee) => {
    if (!window.confirm(`Delete employee "${row.name}"?`)) return;
    try {
      await deleteEmployee(row.id!);
      fetchData();
    } catch (err: any) {
      alert(err?.response?.data?.detail || "Failed to delete employee");
    }
  };

  const columns: Column<Employee>[] = [
    { key: "id", header: "ID" },
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "phone", header: "Phone" },
    { key: "department_id", header: "Department" },
    { key: "role_id", header: "Role" },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <h2>Employees</h2>
        <div className="admin-page-toolbar">
          <SearchBar value={search} onChange={setSearch} placeholder="Search employees..." />
          <button type="button" className="admin-btn" onClick={() => setShowAdd(true)}>
            + Add Employee
          </button>
        </div>
      </div>

      <DataTable columns={columns} rows={data?.results ?? []} loading={loading} onEdit={setEditing} onDelete={handleDelete} />

      {data && (
        <Pagination
          count={data.count}
          currentPage={data.current_page}
          totalPages={data.total_pages}
          hasNext={data.next !== null}
          hasPrevious={data.previous !== null}
          onPageChange={setPage}
        />
      )}

      {showAdd && (
        <Modal title="Add Employee" onClose={() => setShowAdd(false)}>
          <AddEmployee
            onSuccess={() => {
              setShowAdd(false);
              fetchData();
            }}
            onCancel={() => setShowAdd(false)}
          />
        </Modal>
      )}

      {editing && (
        <Modal title="Edit Employee" onClose={() => setEditing(null)}>
          <EditEmployee
            employee={editing}
            onSuccess={() => {
              setEditing(null);
              fetchData();
            }}
            onCancel={() => setEditing(null)}
          />
        </Modal>
      )}
    </div>
  );
}
