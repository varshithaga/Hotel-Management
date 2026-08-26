import { useCallback, useEffect, useState } from "react";
import DataTable, { type Column } from "../components/DataTable";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import Modal from "../components/Modal";
import AddReview from "./AddReview";
import EditReview from "./EditReview";
import { deleteReview, getReviewList, type Review, type PaginatedResponses } from "./api";

export default function ReviewsPage() {
  const [data, setData] = useState<PaginatedResponses<Review> | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Review | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getReviewList(page, 10, search);
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

  const handleDelete = async (row: Review) => {
    if (!window.confirm(`Delete review #${row.id}?`)) return;
    try {
      await deleteReview(row.id!);
      fetchData();
    } catch (err: any) {
      alert(err?.response?.data?.detail || "Failed to delete review");
    }
  };

  const columns: Column<Review>[] = [
    { key: "id", header: "ID" },
    { key: "booking_id", header: "Booking" },
    { key: "rating", header: "Rating" },
    { key: "comment", header: "Comment" },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <h2>Reviews</h2>
        <div className="admin-page-toolbar">
          <SearchBar value={search} onChange={setSearch} placeholder="Search comments..." />
          <button type="button" className="admin-btn" onClick={() => setShowAdd(true)}>
            + Add Review
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
        <Modal title="Add Review" onClose={() => setShowAdd(false)}>
          <AddReview
            onSuccess={() => {
              setShowAdd(false);
              fetchData();
            }}
            onCancel={() => setShowAdd(false)}
          />
        </Modal>
      )}

      {editing && (
        <Modal title="Edit Review" onClose={() => setEditing(null)}>
          <EditReview
            review={editing}
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
