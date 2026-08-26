import type { ReactNode } from "react";

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  loading: boolean;
  keyField?: keyof T;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
}

export default function DataTable<T extends Record<string, any>>({
  columns,
  rows,
  loading,
  keyField = "id" as keyof T,
  onEdit,
  onDelete,
}: DataTableProps<T>) {
  const showActions = !!(onEdit || onDelete);

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.header}</th>
            ))}
            {showActions && <th className="admin-table-actions-col">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length + (showActions ? 1 : 0)} className="admin-table-empty">
                Loading...
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (showActions ? 1 : 0)} className="admin-table-empty">
                No records found.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={String(row[keyField])}>
                {columns.map((col) => (
                  <td key={col.key}>{col.render ? col.render(row) : row[col.key] ?? "—"}</td>
                ))}
                {showActions && (
                  <td className="admin-table-actions-col">
                    <div className="admin-row-actions">
                      {onEdit && (
                        <button type="button" className="admin-btn admin-btn-sm" onClick={() => onEdit(row)}>
                          Edit
                        </button>
                      )}
                      {onDelete && (
                        <button
                          type="button"
                          className="admin-btn admin-btn-sm admin-btn-danger"
                          onClick={() => onDelete(row)}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
