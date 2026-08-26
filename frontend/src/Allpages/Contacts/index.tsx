import { useCallback, useEffect, useState } from "react";
import DataTable, { type Column } from "../components/DataTable";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import Modal from "../components/Modal";
import AddContact from "./AddContact";
import EditContact from "./EditContact";
import { deleteContact, getContactList, type ContactForm, type PaginatedResponses } from "./api";

export default function ContactsPage() {
  const [data, setData] = useState<PaginatedResponses<ContactForm> | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<ContactForm | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getContactList(page, 10, search);
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

  const handleDelete = async (row: ContactForm) => {
    if (!window.confirm(`Delete contact form entry from "${row.name}"?`)) return;
    try {
      await deleteContact(row.id!);
      fetchData();
    } catch (err: any) {
      alert(err?.response?.data?.detail || "Failed to delete contact form entry");
    }
  };

  const columns: Column<ContactForm>[] = [
    { key: "id", header: "ID" },
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "subject", header: "Subject" },
    { key: "call_status", header: "Call Status" },
    { key: "answer_status", header: "Answer Status" },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <h2>Contact Forms</h2>
        <div className="admin-page-toolbar">
          <SearchBar value={search} onChange={setSearch} placeholder="Search contacts..." />
          <button type="button" className="admin-btn" onClick={() => setShowAdd(true)}>
            + Add Contact
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
        <Modal title="Add Contact" onClose={() => setShowAdd(false)}>
          <AddContact
            onSuccess={() => {
              setShowAdd(false);
              fetchData();
            }}
            onCancel={() => setShowAdd(false)}
          />
        </Modal>
      )}

      {editing && (
        <Modal title="Update Contact Status" onClose={() => setEditing(null)}>
          <EditContact
            contact={editing}
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
