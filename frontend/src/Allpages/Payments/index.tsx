import { useCallback, useEffect, useState } from "react";
import DataTable, { type Column } from "../components/DataTable";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import Modal from "../components/Modal";
import AddPayment from "./AddPayment";
import EditPayment from "./EditPayment";
import { deletePayment, getPaymentList, type Payment, type PaginatedResponses } from "./api";

export default function PaymentsPage() {
  const [data, setData] = useState<PaginatedResponses<Payment> | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Payment | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getPaymentList(page, 10, search);
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

  const handleDelete = async (row: Payment) => {
    if (!window.confirm(`Delete payment #${row.id}?`)) return;
    try {
      await deletePayment(row.id!);
      fetchData();
    } catch (err: any) {
      alert(err?.response?.data?.detail || "Failed to delete payment");
    }
  };

  const columns: Column<Payment>[] = [
    { key: "id", header: "ID" },
    { key: "booking_id", header: "Booking" },
    { key: "amount", header: "Amount" },
    { key: "method", header: "Method" },
    { key: "status", header: "Status" },
    { key: "transaction_ref", header: "Reference" },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <h2>Payments</h2>
        <div className="admin-page-toolbar">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by reference..." />
          <button type="button" className="admin-btn" onClick={() => setShowAdd(true)}>
            + Add Payment
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
        <Modal title="Add Payment" onClose={() => setShowAdd(false)}>
          <AddPayment
            onSuccess={() => {
              setShowAdd(false);
              fetchData();
            }}
            onCancel={() => setShowAdd(false)}
          />
        </Modal>
      )}

      {editing && (
        <Modal title="Edit Payment" onClose={() => setEditing(null)}>
          <EditPayment
            payment={editing}
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
