import { useCallback, useEffect, useState } from "react";
import DataTable, { type Column } from "../components/DataTable";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import Modal from "../components/Modal";
import AddStaffRole from "./AddStaffRole";
import EditStaffRole from "./EditStaffRole";
import { deleteStaffRole, getStaffRoleList, type StaffRole, type PaginatedResponses } from "./api";

export default function StaffRolesPage() {
  const [data, setData] = useState<PaginatedResponses<StaffRole> | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<StaffRole | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getStaffRoleList(page, 10, search);
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

  const handleDelete = async (row: StaffRole) => {
    if (!window.confirm(`Delete staff role "${row.name}"?`)) return;
    try {
      await deleteStaffRole(row.id!);
      fetchData();
    } catch (err: any) {
      alert(err?.response?.data?.detail || "Failed to delete staff role");
    }
  };

  const columns: Column<StaffRole>[] = [
    { key: "id", header: "ID" },
    { key: "name", header: "Name" },
    { key: "description", header: "Description" },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <h2>Staff Roles</h2>
        <div className="admin-page-toolbar">
          <SearchBar value={search} onChange={setSearch} placeholder="Search staff roles..." />
          <button type="button" className="admin-btn" onClick={() => setShowAdd(true)}>
            + Add Staff Role
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
        <Modal title="Add Staff Role" onClose={() => setShowAdd(false)}>
          <AddStaffRole
            onSuccess={() => {
              setShowAdd(false);
              fetchData();
            }}
            onCancel={() => setShowAdd(false)}
          />
        </Modal>
      )}

      {editing && (
        <Modal title="Edit Staff Role" onClose={() => setEditing(null)}>
          <EditStaffRole
            staffRole={editing}
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
