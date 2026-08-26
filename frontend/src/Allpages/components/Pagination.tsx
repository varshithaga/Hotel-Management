interface PaginationProps {
  count: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  count,
  currentPage,
  totalPages,
  hasNext,
  hasPrevious,
  onPageChange,
}: PaginationProps) {
  if (count === 0) return null;

  return (
    <div className="admin-pagination">
      <span className="admin-pagination-info">
        Page {currentPage} of {totalPages} · {count} total
      </span>
      <div className="admin-pagination-controls">
        <button
          type="button"
          className="admin-btn admin-btn-sm"
          disabled={!hasPrevious}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </button>
        <button
          type="button"
          className="admin-btn admin-btn-sm"
          disabled={!hasNext}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
