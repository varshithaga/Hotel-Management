import { useCallback, useEffect, useState } from "react";
import DataTable, { type Column } from "../components/DataTable";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import Modal from "../components/Modal";
import AddAmenity from "./AddAmenity";
import EditAmenity from "./EditAmenity";
import { deleteAmenity, getAmenityList, type Amenity, type PaginatedResponses } from "./api";

export default function AmenitiesPage() {
  const [data, setData] = useState<PaginatedResponses<Amenity> | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Amenity | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAmenityList(page, 10, search);
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

  const handleDelete = async (row: Amenity) => {
    if (!window.confirm(`Delete amenity "${row.name}"?`)) return;
    try {
      await deleteAmenity(row.id!);
      fetchData();
    } catch (err: any) {
      alert(err?.response?.data?.detail || "Failed to delete amenity");
    }
  };

  const columns: Column<Amenity>[] = [
    { key: "id", header: "ID" },
    { key: "name", header: "Name" },
    { key: "icon", header: "Icon" },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <h2>Amenities</h2>
        <div className="admin-page-toolbar">
          <SearchBar value={search} onChange={setSearch} placeholder="Search amenities..." />
          <button type="button" className="admin-btn" onClick={() => setShowAdd(true)}>
            + Add Amenity
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
        <Modal title="Add Amenity" onClose={() => setShowAdd(false)}>
          <AddAmenity
            onSuccess={() => {
              setShowAdd(false);
              fetchData();
            }}
            onCancel={() => setShowAdd(false)}
          />
        </Modal>
      )}

      {editing && (
        <Modal title="Edit Amenity" onClose={() => setEditing(null)}>
          <EditAmenity
            amenity={editing}
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
