import { useCallback, useEffect, useState } from "react";
import DataTable, { type Column } from "../components/DataTable";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import Modal from "../components/Modal";
import AddWorkAssignment from "./AddWorkAssignment";
import EditWorkAssignment from "./EditWorkAssignment";
import { deleteWorkAssignment, getWorkAssignmentList, type WorkAssignment, type PaginatedResponses } from "./api";

export default function WorkAssignmentsPage() {
  const [data, setData] = useState<PaginatedResponses<WorkAssignment> | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<WorkAssignment | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getWorkAssignmentList(page, 10, search);
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

  const handleDelete = async (row: WorkAssignment) => {
    if (!window.confirm(`Delete work assignment #${row.id}?`)) return;
    try {
      await deleteWorkAssignment(row.id!);
      fetchData();
    } catch (err: any) {
      alert(err?.response?.data?.detail || "Failed to delete work assignment");
    }
  };

  const columns: Column<WorkAssignment>[] = [
    { key: "id", header: "ID" },
    { key: "work_type_id", header: "Work Type" },
    { key: "start_date", header: "Start" },
    { key: "end_date", header: "End" },
    { key: "status", header: "Status" },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <h2>Work Assignments</h2>
        <div className="admin-page-toolbar">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by status..." />
          <button type="button" className="admin-btn" onClick={() => setShowAdd(true)}>
            + Add Assignment
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
        <Modal title="Add Work Assignment" onClose={() => setShowAdd(false)}>
          <AddWorkAssignment
            onSuccess={() => {
              setShowAdd(false);
              fetchData();
            }}
            onCancel={() => setShowAdd(false)}
          />
        </Modal>
      )}

      {editing && (
        <Modal title="Edit Work Assignment" onClose={() => setEditing(null)}>
          <EditWorkAssignment
            assignment={editing}
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
