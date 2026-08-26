import { useEffect, useState, type FormEvent } from "react";
import { createPayment, type Payment } from "./api";
import { getBookingList, type AllBooking } from "../Bookings/api";

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AddPayment({ onSuccess, onCancel }: Props) {
  const [bookings, setBookings] = useState<AllBooking[]>([]);
  const [bookingId, setBookingId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<Payment["method"]>("cash");
  const [status, setStatus] = useState<NonNullable<Payment["status"]>>("pending");
  const [transactionRef, setTransactionRef] = useState("");
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
      await createPayment({
        booking_id: Number(bookingId),
        amount: Number(amount),
        method: method!,
        status,
        transaction_ref: transactionRef || undefined,
      });
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to create payment");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="admin-form-error">{error}</div>}
      <div className="admin-form-field">
        <label htmlFor="pay-booking">Booking</label>
        <select id="pay-booking" value={bookingId} onChange={(e) => setBookingId(e.target.value)} required>
          <option value="">Select booking</option>
          {bookings.map((b) => (
            <option key={b.id} value={b.id}>
              #{b.id} · {b.user_name}
            </option>
          ))}
        </select>
      </div>
      <div className="admin-form-field">
        <label htmlFor="pay-amount">Amount</label>
        <input id="pay-amount" type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
      </div>
      <div className="admin-form-field">
        <label htmlFor="pay-method">Method</label>
        <select id="pay-method" value={method} onChange={(e) => setMethod(e.target.value as Payment["method"])}>
          <option value="cash">Cash</option>
          <option value="card">Card</option>
          <option value="upi">UPI</option>
          <option value="bank_transfer">Bank Transfer</option>
        </select>
      </div>
      <div className="admin-form-field">
        <label htmlFor="pay-status">Status</label>
        <select id="pay-status" value={status} onChange={(e) => setStatus(e.target.value as NonNullable<Payment["status"]>)}>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>
      <div className="admin-form-field">
        <label htmlFor="pay-ref">Transaction Ref</label>
        <input id="pay-ref" value={transactionRef} onChange={(e) => setTransactionRef(e.target.value)} />
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
