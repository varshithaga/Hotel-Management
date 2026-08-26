import { useState, type FormEvent } from "react";
import { updateReview, type Review } from "./api";

interface Props {
  review: Review;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function EditReview({ review, onSuccess, onCancel }: Props) {
  const [rating, setRating] = useState(String(review.rating));
  const [comment, setComment] = useState(review.comment ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await updateReview(review.id!, { rating: Number(rating), comment });
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to update review");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="admin-form-error">{error}</div>}
      <div className="admin-form-field">
        <label htmlFor="edit-rev-rating">Rating (1-5)</label>
        <input id="edit-rev-rating" type="number" min={1} max={5} value={rating} onChange={(e) => setRating(e.target.value)} required />
      </div>
      <div className="admin-form-field">
        <label htmlFor="edit-rev-comment">Comment</label>
        <textarea id="edit-rev-comment" value={comment} onChange={(e) => setComment(e.target.value)} />
      </div>
      <div className="admin-form-actions">
        <button type="button" className="admin-btn admin-btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="admin-btn" disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
