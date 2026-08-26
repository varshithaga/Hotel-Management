import { useCallback, useEffect, useState } from "react";
import DataTable, { type Column } from "../components/DataTable";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import Modal from "../components/Modal";
import AddFloor from "./AddFloor";
import EditFloor from "./EditFloor";
import { deleteFloor, getFloorList, type Floor, type PaginatedResponses } from "./api";

export default function FloorsPage() {
  const [data, setData] = useState<PaginatedResponses<Floor> | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Floor | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getFloorList(page, 10, search);
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

  const handleDelete = async (row: Floor) => {
    if (!window.confirm(`Delete floor "${row.name}"?`)) return;
    try {
      await deleteFloor(row.id!);
      fetchData();
    } catch (err: any) {
      alert(err?.response?.data?.detail || "Failed to delete floor");
    }
  };

  const columns: Column<Floor>[] = [
    { key: "id", header: "ID" },
    { key: "name", header: "Name" },
    { key: "description", header: "Description" },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <h2>Floors</h2>
        <div className="admin-page-toolbar">
          <SearchBar value={search} onChange={setSearch} placeholder="Search floors..." />
          <button type="button" className="admin-btn" onClick={() => setShowAdd(true)}>
            + Add Floor
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
        <Modal title="Add Floor" onClose={() => setShowAdd(false)}>
          <AddFloor
            onSuccess={() => {
              setShowAdd(false);
              fetchData();
            }}
            onCancel={() => setShowAdd(false)}
          />
        </Modal>
      )}

      {editing && (
        <Modal title="Edit Floor" onClose={() => setEditing(null)}>
          <EditFloor
            floor={editing}
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
