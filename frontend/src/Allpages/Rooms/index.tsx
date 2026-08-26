import { useCallback, useEffect, useState } from "react";
import DataTable, { type Column } from "../components/DataTable";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import Modal from "../components/Modal";
import AddRoom from "./AddRoom";
import EditRoom from "./EditRoom";
import { deleteRoom, getRoomList, type Room, type PaginatedResponses } from "./api";

export default function RoomsPage() {
  const [data, setData] = useState<PaginatedResponses<Room> | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Room | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getRoomList(page, 10, search);
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

  const handleDelete = async (row: Room) => {
    if (!window.confirm(`Delete room "${row.name}"?`)) return;
    try {
      await deleteRoom(row.id!);
      fetchData();
    } catch (err: any) {
      alert(err?.response?.data?.detail || "Failed to delete room");
    }
  };

  const columns: Column<Room>[] = [
    { key: "id", header: "ID" },
    { key: "name", header: "Name" },
    { key: "price_per_night", header: "Price/Night" },
    { key: "capacity", header: "Capacity" },
    { key: "is_active", header: "Active", render: (row) => (row.is_active ? "Yes" : "No") },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <h2>Rooms</h2>
        <div className="admin-page-toolbar">
          <SearchBar value={search} onChange={setSearch} placeholder="Search rooms..." />
          <button type="button" className="admin-btn" onClick={() => setShowAdd(true)}>
            + Add Room
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
        <Modal title="Add Room" onClose={() => setShowAdd(false)}>
          <AddRoom
            onSuccess={() => {
              setShowAdd(false);
              fetchData();
            }}
            onCancel={() => setShowAdd(false)}
          />
        </Modal>
      )}

      {editing && (
        <Modal title="Edit Room" onClose={() => setEditing(null)}>
          <EditRoom
            room={editing}
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
