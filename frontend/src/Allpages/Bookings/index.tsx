import { useCallback, useEffect, useState } from "react";
import DataTable, { type Column } from "../components/DataTable";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import Modal from "../components/Modal";
import AddBooking from "./AddBooking";
import EditBooking from "./EditBooking";
import { deleteBooking, getBookingList, type AllBooking, type PaginatedResponses } from "./api";

export default function BookingsPage() {
  const [data, setData] = useState<PaginatedResponses<AllBooking> | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<AllBooking | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getBookingList(page, 10, search);
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

  const handleDelete = async (row: AllBooking) => {
    if (!window.confirm(`Delete booking for "${row.user_name}"?`)) return;
    try {
      await deleteBooking(row.id!);
      fetchData();
    } catch (err: any) {
      alert(err?.response?.data?.detail || "Failed to delete booking");
    }
  };

  const columns: Column<AllBooking>[] = [
    { key: "id", header: "ID" },
    { key: "user_name", header: "Guest" },
    { key: "room_id", header: "Room ID" },
    { key: "check_in_date", header: "Check-in" },
    { key: "check_out_date", header: "Check-out" },
    { key: "total_price", header: "Total" },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <h2>Bookings</h2>
        <div className="admin-page-toolbar">
          <SearchBar value={search} onChange={setSearch} placeholder="Search bookings..." />
          <button type="button" className="admin-btn" onClick={() => setShowAdd(true)}>
            + Add Booking
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
        <Modal title="Add Booking" onClose={() => setShowAdd(false)}>
          <AddBooking
            onSuccess={() => {
              setShowAdd(false);
              fetchData();
            }}
            onCancel={() => setShowAdd(false)}
          />
        </Modal>
      )}

      {editing && (
        <Modal title="Edit Booking" onClose={() => setEditing(null)}>
          <EditBooking
            booking={editing}
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
