import { useCallback, useEffect, useState } from "react";
import DataTable, { type Column } from "../components/DataTable";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import Modal from "../components/Modal";
import AddRoomType from "./AddRoomType";
import EditRoomType from "./EditRoomType";
import { deleteRoomType, getRoomTypeList, type RoomType, type PaginatedResponses } from "./api";

export default function RoomTypesPage() {
  const [data, setData] = useState<PaginatedResponses<RoomType> | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<RoomType | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getRoomTypeList(page, 10, search);
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

  const handleDelete = async (row: RoomType) => {
    if (!window.confirm(`Delete room type "${row.name}"?`)) return;
    try {
      await deleteRoomType(row.id!);
      fetchData();
    } catch (err: any) {
      alert(err?.response?.data?.detail || "Failed to delete room type");
    }
  };

  const columns: Column<RoomType>[] = [
    { key: "id", header: "ID" },
    { key: "name", header: "Name" },
    { key: "description", header: "Description" },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <h2>Room Types</h2>
        <div className="admin-page-toolbar">
          <SearchBar value={search} onChange={setSearch} placeholder="Search room types..." />
          <button type="button" className="admin-btn" onClick={() => setShowAdd(true)}>
            + Add Room Type
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
        <Modal title="Add Room Type" onClose={() => setShowAdd(false)}>
          <AddRoomType
            onSuccess={() => {
              setShowAdd(false);
              fetchData();
            }}
            onCancel={() => setShowAdd(false)}
          />
        </Modal>
      )}

      {editing && (
        <Modal title="Edit Room Type" onClose={() => setEditing(null)}>
          <EditRoomType
            roomType={editing}
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
