import { useEffect, useState, type FormEvent } from "react";
import { updateBooking, type AllBooking } from "./api";
import { getRoomList, type Room } from "../Rooms/api";

interface Props {
  booking: AllBooking;
  onSuccess: () => void;
  onCancel: () => void;
}

function toLocalInput(value?: string) {
  if (!value) return "";
  return value.slice(0, 16);
}

export default function EditBooking({ booking, onSuccess, onCancel }: Props) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [userName, setUserName] = useState(booking.user_name);
  const [userEmail, setUserEmail] = useState(booking.user_email);
  const [userPhone, setUserPhone] = useState(booking.user_phone);
  const [roomId, setRoomId] = useState(String(booking.room_id));
  const [checkIn, setCheckIn] = useState(toLocalInput(booking.check_in_date));
  const [checkOut, setCheckOut] = useState(toLocalInput(booking.check_out_date));
  const [noOfDays, setNoOfDays] = useState(String(booking.no_of_days));
  const [price, setPrice] = useState(String(booking.price));
  const [extraCharges, setExtraCharges] = useState(booking.extra_charges != null ? String(booking.extra_charges) : "");
  const [discount, setDiscount] = useState(booking.discount != null ? String(booking.discount) : "");
  const [totalPrice, setTotalPrice] = useState(String(booking.total_price));
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
      await updateBooking(booking.id!, {
        user_name: userName,
        user_email: userEmail,
        user_phone: userPhone,
        room_id: Number(roomId),
        check_in_date: checkIn,
        check_out_date: checkOut,
        no_of_days: Number(noOfDays),
        price: Number(price),
        extra_charges: extraCharges ? Number(extraCharges) : undefined,
        discount: discount ? Number(discount) : undefined,
        total_price: Number(totalPrice),
      });
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to update booking");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="admin-form-error">{error}</div>}
      <div className="admin-form-field">
        <label htmlFor="edit-bk-name">Guest Name</label>
        <input id="edit-bk-name" value={userName} onChange={(e) => setUserName(e.target.value)} required />
      </div>
      <div className="admin-form-field">
        <label htmlFor="edit-bk-email">Guest Email</label>
        <input id="edit-bk-email" type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} required />
      </div>
      <div className="admin-form-field">
        <label htmlFor="edit-bk-phone">Guest Phone</label>
        <input id="edit-bk-phone" value={userPhone} onChange={(e) => setUserPhone(e.target.value)} required />
      </div>
      <div className="admin-form-field">
        <label htmlFor="edit-bk-room">Room</label>
        <select id="edit-bk-room" value={roomId} onChange={(e) => setRoomId(e.target.value)} required>
          {rooms.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>
      <div className="admin-form-field">
        <label htmlFor="edit-bk-checkin">Check-in</label>
        <input id="edit-bk-checkin" type="datetime-local" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} required />
      </div>
      <div className="admin-form-field">
        <label htmlFor="edit-bk-checkout">Check-out</label>
        <input id="edit-bk-checkout" type="datetime-local" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} required />
      </div>
      <div className="admin-form-field">
        <label htmlFor="edit-bk-days">No. of Days</label>
        <input id="edit-bk-days" type="number" value={noOfDays} onChange={(e) => setNoOfDays(e.target.value)} required />
      </div>
      <div className="admin-form-field">
        <label htmlFor="edit-bk-price">Price</label>
        <input id="edit-bk-price" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
      </div>
      <div className="admin-form-field">
        <label htmlFor="edit-bk-extra">Extra Charges</label>
        <input id="edit-bk-extra" type="number" step="0.01" value={extraCharges} onChange={(e) => setExtraCharges(e.target.value)} />
      </div>
      <div className="admin-form-field">
        <label htmlFor="edit-bk-discount">Discount</label>
        <input id="edit-bk-discount" type="number" step="0.01" value={discount} onChange={(e) => setDiscount(e.target.value)} />
      </div>
      <div className="admin-form-field">
        <label htmlFor="edit-bk-total">Total Price</label>
        <input id="edit-bk-total" type="number" step="0.01" value={totalPrice} onChange={(e) => setTotalPrice(e.target.value)} required />
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
