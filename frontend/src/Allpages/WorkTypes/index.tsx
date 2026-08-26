import { useCallback, useEffect, useState } from "react";
import DataTable, { type Column } from "../components/DataTable";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import Modal from "../components/Modal";
import AddWorkType from "./AddWorkType";
import EditWorkType from "./EditWorkType";
import { deleteWorkType, getWorkTypeList, type WorkType, type PaginatedResponses } from "./api";

export default function WorkTypesPage() {
  const [data, setData] = useState<PaginatedResponses<WorkType> | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<WorkType | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getWorkTypeList(page, 10, search);
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

  const handleDelete = async (row: WorkType) => {
    if (!window.confirm(`Delete work type "${row.name}"?`)) return;
    try {
      await deleteWorkType(row.id!);
      fetchData();
    } catch (err: any) {
      alert(err?.response?.data?.detail || "Failed to delete work type");
    }
  };

  const columns: Column<WorkType>[] = [
    { key: "id", header: "ID" },
    { key: "name", header: "Name" },
    { key: "description", header: "Description" },
    { key: "is_active", header: "Active", render: (row) => (row.is_active ? "Yes" : "No") },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <h2>Work Types</h2>
        <div className="admin-page-toolbar">
          <SearchBar value={search} onChange={setSearch} placeholder="Search work types..." />
          <button type="button" className="admin-btn" onClick={() => setShowAdd(true)}>
            + Add Work Type
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
        <Modal title="Add Work Type" onClose={() => setShowAdd(false)}>
          <AddWorkType
            onSuccess={() => {
              setShowAdd(false);
              fetchData();
            }}
            onCancel={() => setShowAdd(false)}
          />
        </Modal>
      )}

      {editing && (
        <Modal title="Edit Work Type" onClose={() => setEditing(null)}>
          <EditWorkType
            workType={editing}
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
