import { useCallback, useEffect, useState } from "react";
import DataTable, { type Column } from "../components/DataTable";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import Modal from "../components/Modal";
import AddUser from "./AddUser";
import EditUser from "./EditUser";
import { deleteUser, getUserList, type User, type PaginatedResponses } from "./api";

export default function UsersPage() {
  const [data, setData] = useState<PaginatedResponses<User> | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getUserList(page, 10, search);
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

  const handleDelete = async (row: User) => {
    if (!window.confirm(`Delete user "${row.username}"?`)) return;
    try {
      await deleteUser(row.id!);
      fetchData();
    } catch (err: any) {
      alert(err?.response?.data?.detail || "Failed to delete user");
    }
  };

  const columns: Column<User>[] = [
    { key: "id", header: "ID" },
    { key: "username", header: "Username" },
    { key: "email", header: "Email" },
    { key: "full_name", header: "Full Name" },
    { key: "role", header: "Role" },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <h2>Users</h2>
        <div className="admin-page-toolbar">
          <SearchBar value={search} onChange={setSearch} placeholder="Search users..." />
          <button type="button" className="admin-btn" onClick={() => setShowAdd(true)}>
            + Add User
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
        <Modal title="Add User" onClose={() => setShowAdd(false)}>
          <AddUser
            onSuccess={() => {
              setShowAdd(false);
              fetchData();
            }}
            onCancel={() => setShowAdd(false)}
          />
        </Modal>
      )}

      {editing && (
        <Modal title="Edit User" onClose={() => setEditing(null)}>
          <EditUser
            user={editing}
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
