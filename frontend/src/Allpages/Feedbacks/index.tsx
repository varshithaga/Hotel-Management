import { useCallback, useEffect, useState } from "react";
import DataTable, { type Column } from "../components/DataTable";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import Modal from "../components/Modal";
import AddFeedback from "./AddFeedback";
import EditFeedback from "./EditFeedback";
import { deleteFeedback, getFeedbackList, type Feedback, type PaginatedResponses } from "./api";

export default function FeedbacksPage() {
  const [data, setData] = useState<PaginatedResponses<Feedback> | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Feedback | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getFeedbackList(page, 10, search);
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

  const handleDelete = async (row: Feedback) => {
    if (!window.confirm(`Delete feedback from "${row.name}"?`)) return;
    try {
      await deleteFeedback(row.id!);
      fetchData();
    } catch (err: any) {
      alert(err?.response?.data?.detail || "Failed to delete feedback");
    }
  };

  const columns: Column<Feedback>[] = [
    { key: "id", header: "ID" },
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "subject", header: "Subject" },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <h2>Feedbacks</h2>
        <div className="admin-page-toolbar">
          <SearchBar value={search} onChange={setSearch} placeholder="Search feedback..." />
          <button type="button" className="admin-btn" onClick={() => setShowAdd(true)}>
            + Add Feedback
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
        <Modal title="Add Feedback" onClose={() => setShowAdd(false)}>
          <AddFeedback
            onSuccess={() => {
              setShowAdd(false);
              fetchData();
            }}
            onCancel={() => setShowAdd(false)}
          />
        </Modal>
      )}

      {editing && (
        <Modal title="Edit Feedback" onClose={() => setEditing(null)}>
          <EditFeedback
            feedback={editing}
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
