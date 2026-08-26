import { useEffect, useState, type FormEvent } from "react";
import { createReview } from "./api";
import { getBookingList, type AllBooking } from "../Bookings/api";

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AddReview({ onSuccess, onCancel }: Props) {
  const [bookings, setBookings] = useState<AllBooking[]>([]);
  const [bookingId, setBookingId] = useState("");
  const [rating, setRating] = useState("5");
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getBookingList(1, "all").then((res) => setBookings(res.results));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await createReview({ booking_id: Number(bookingId), rating: Number(rating), comment });
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to create review");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="admin-form-error">{error}</div>}
      <div className="admin-form-field">
        <label htmlFor="rev-booking">Booking</label>
        <select id="rev-booking" value={bookingId} onChange={(e) => setBookingId(e.target.value)} required>
          <option value="">Select booking</option>
          {bookings.map((b) => (
            <option key={b.id} value={b.id}>
              #{b.id} · {b.user_name}
            </option>
          ))}
        </select>
      </div>
      <div className="admin-form-field">
        <label htmlFor="rev-rating">Rating (1-5)</label>
        <input id="rev-rating" type="number" min={1} max={5} value={rating} onChange={(e) => setRating(e.target.value)} required />
      </div>
      <div className="admin-form-field">
        <label htmlFor="rev-comment">Comment</label>
        <textarea id="rev-comment" value={comment} onChange={(e) => setComment(e.target.value)} />
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
