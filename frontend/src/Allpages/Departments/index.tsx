import { useCallback, useEffect, useState } from "react";
import DataTable, { type Column } from "../components/DataTable";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import Modal from "../components/Modal";
import AddDepartment from "./AddDepartment";
import EditDepartment from "./EditDepartment";
import { deleteDepartment, getDepartmentList, type Department, type PaginatedResponses } from "./api";

export default function DepartmentsPage() {
  const [data, setData] = useState<PaginatedResponses<Department> | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Department | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getDepartmentList(page, 10, search);
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

  const handleDelete = async (row: Department) => {
    if (!window.confirm(`Delete department "${row.name}"?`)) return;
    try {
      await deleteDepartment(row.id!);
      fetchData();
    } catch (err: any) {
      alert(err?.response?.data?.detail || "Failed to delete department");
    }
  };

  const columns: Column<Department>[] = [
    { key: "id", header: "ID" },
    { key: "name", header: "Name" },
    { key: "description", header: "Description" },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <h2>Departments</h2>
        <div className="admin-page-toolbar">
          <SearchBar value={search} onChange={setSearch} placeholder="Search departments..." />
          <button type="button" className="admin-btn" onClick={() => setShowAdd(true)}>
            + Add Department
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
        <Modal title="Add Department" onClose={() => setShowAdd(false)}>
          <AddDepartment
            onSuccess={() => {
              setShowAdd(false);
              fetchData();
            }}
            onCancel={() => setShowAdd(false)}
          />
        </Modal>
      )}

      {editing && (
        <Modal title="Edit Department" onClose={() => setEditing(null)}>
          <EditDepartment
            department={editing}
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
