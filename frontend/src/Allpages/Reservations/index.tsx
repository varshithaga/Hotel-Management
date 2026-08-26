import { useCallback, useEffect, useState } from "react";
import DataTable, { type Column } from "../components/DataTable";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import Modal from "../components/Modal";
import AddReservation from "./AddReservation";
import EditReservation from "./EditReservation";
import { deleteReservation, getReservationList, type Reservation, type PaginatedResponses } from "./api";

export default function ReservationsPage() {
  const [data, setData] = useState<PaginatedResponses<Reservation> | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Reservation | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getReservationList(page, 10, search);
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

  const handleDelete = async (row: Reservation) => {
    if (!window.confirm(`Delete reservation for "${row.user_name}"?`)) return;
    try {
      await deleteReservation(row.id!);
      fetchData();
    } catch (err: any) {
      alert(err?.response?.data?.detail || "Failed to delete reservation");
    }
  };

  const columns: Column<Reservation>[] = [
    { key: "id", header: "ID" },
    { key: "user_name", header: "Guest" },
    { key: "user_email", header: "Email" },
    { key: "reserved_check_in_date", header: "Check-in" },
    { key: "reserved_check_out_date", header: "Check-out" },
    { key: "total_price", header: "Total" },
    { key: "is_it_canceled", header: "Canceled", render: (row) => (row.is_it_canceled ? "Yes" : "No") },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <h2>Reservations</h2>
        <div className="admin-page-toolbar">
          <SearchBar value={search} onChange={setSearch} placeholder="Search reservations..." />
          <button type="button" className="admin-btn" onClick={() => setShowAdd(true)}>
            + Add Reservation
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
        <Modal title="Add Reservation" onClose={() => setShowAdd(false)}>
          <AddReservation
            onSuccess={() => {
              setShowAdd(false);
              fetchData();
            }}
            onCancel={() => setShowAdd(false)}
          />
        </Modal>
      )}

      {editing && (
        <Modal title="Edit Reservation" onClose={() => setEditing(null)}>
          <EditReservation
            reservation={editing}
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
