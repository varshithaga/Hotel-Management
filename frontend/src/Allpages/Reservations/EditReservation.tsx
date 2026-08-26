import { useEffect, useState, type FormEvent } from "react";
import { updateReservation, type Reservation } from "./api";
import { getRoomList, type Room } from "../Rooms/api";

interface Props {
  reservation: Reservation;
  onSuccess: () => void;
  onCancel: () => void;
}

function toLocalInput(value?: string) {
  if (!value) return "";
  return value.slice(0, 16);
}

export default function EditReservation({ reservation, onSuccess, onCancel }: Props) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [userName, setUserName] = useState(reservation.user_name);
  const [userEmail, setUserEmail] = useState(reservation.user_email);
  const [userPhone, setUserPhone] = useState(reservation.user_phone);
  const [checkIn, setCheckIn] = useState(toLocalInput(reservation.reserved_check_in_date));
  const [checkOut, setCheckOut] = useState(toLocalInput(reservation.reserved_check_out_date));
  const [totalPrice, setTotalPrice] = useState(String(reservation.total_price));
  const [isCanceled, setIsCanceled] = useState(reservation.is_it_canceled ?? false);
  const [canceledReason, setCanceledReason] = useState(reservation.canceled_reason ?? "");
  const [roomIds, setRoomIds] = useState<string[]>((reservation.room_ids ?? []).map(String));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getRoomList(1, "all").then((res) => setRooms(res.results));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await updateReservation(reservation.id!, {
        user_name: userName,
        user_email: userEmail,
        user_phone: userPhone,
        reserved_check_in_date: checkIn,
        reserved_check_out_date: checkOut,
        total_price: Number(totalPrice),
        is_it_canceled: isCanceled,
        canceled_reason: canceledReason || undefined,
        room_ids: roomIds.map(Number),
      });
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to update reservation");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="admin-form-error">{error}</div>}
      <div className="admin-form-field">
        <label htmlFor="edit-res-name">Guest Name</label>
        <input id="edit-res-name" value={userName} onChange={(e) => setUserName(e.target.value)} required />
      </div>
      <div className="admin-form-field">
        <label htmlFor="edit-res-email">Guest Email</label>
        <input id="edit-res-email" type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} required />
      </div>
      <div className="admin-form-field">
        <label htmlFor="edit-res-phone">Guest Phone</label>
        <input id="edit-res-phone" value={userPhone} onChange={(e) => setUserPhone(e.target.value)} required />
      </div>
      <div className="admin-form-field">
        <label htmlFor="edit-res-checkin">Check-in</label>
        <input id="edit-res-checkin" type="datetime-local" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} required />
      </div>
      <div className="admin-form-field">
        <label htmlFor="edit-res-checkout">Check-out</label>
        <input id="edit-res-checkout" type="datetime-local" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} required />
      </div>
      <div className="admin-form-field">
        <label htmlFor="edit-res-price">Total Price</label>
        <input id="edit-res-price" type="number" step="0.01" value={totalPrice} onChange={(e) => setTotalPrice(e.target.value)} required />
      </div>
      <div className="admin-form-field">
        <label htmlFor="edit-res-rooms">Rooms</label>
        <select
          id="edit-res-rooms"
          multiple
          value={roomIds}
          onChange={(e) => setRoomIds(Array.from(e.target.selectedOptions, (o) => o.value))}
        >
          {rooms.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>
      <div className="admin-form-field admin-form-field-checkbox">
        <input id="edit-res-canceled" type="checkbox" checked={isCanceled} onChange={(e) => setIsCanceled(e.target.checked)} />
        <label htmlFor="edit-res-canceled">Canceled</label>
      </div>
      {isCanceled && (
        <div className="admin-form-field">
          <label htmlFor="edit-res-reason">Cancellation Reason</label>
          <input id="edit-res-reason" value={canceledReason} onChange={(e) => setCanceledReason(e.target.value)} />
        </div>
      )}
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
