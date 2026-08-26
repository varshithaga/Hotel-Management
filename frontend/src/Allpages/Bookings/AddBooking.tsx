import { useEffect, useState, type FormEvent } from "react";
import { createBooking } from "./api";
import { getRoomList, type Room } from "../Rooms/api";

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AddBooking({ onSuccess, onCancel }: Props) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [roomId, setRoomId] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [noOfDays, setNoOfDays] = useState("");
  const [price, setPrice] = useState("");
  const [extraCharges, setExtraCharges] = useState("");
  const [discount, setDiscount] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
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
      await createBooking({
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
        was_it_reserved: false,
      });
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to create booking");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="admin-form-error">{error}</div>}
      <div className="admin-form-field">
        <label htmlFor="bk-name">Guest Name</label>
        <input id="bk-name" value={userName} onChange={(e) => setUserName(e.target.value)} required />
      </div>
      <div className="admin-form-field">
        <label htmlFor="bk-email">Guest Email</label>
        <input id="bk-email" type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} required />
      </div>
      <div className="admin-form-field">
        <label htmlFor="bk-phone">Guest Phone</label>
        <input id="bk-phone" value={userPhone} onChange={(e) => setUserPhone(e.target.value)} required />
      </div>
      <div className="admin-form-field">
        <label htmlFor="bk-room">Room</label>
        <select id="bk-room" value={roomId} onChange={(e) => setRoomId(e.target.value)} required>
          <option value="">Select room</option>
          {rooms.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>
      <div className="admin-form-field">
        <label htmlFor="bk-checkin">Check-in</label>
        <input id="bk-checkin" type="datetime-local" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} required />
      </div>
      <div className="admin-form-field">
        <label htmlFor="bk-checkout">Check-out</label>
        <input id="bk-checkout" type="datetime-local" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} required />
      </div>
      <div className="admin-form-field">
        <label htmlFor="bk-days">No. of Days</label>
        <input id="bk-days" type="number" value={noOfDays} onChange={(e) => setNoOfDays(e.target.value)} required />
      </div>
      <div className="admin-form-field">
        <label htmlFor="bk-price">Price</label>
        <input id="bk-price" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
      </div>
      <div className="admin-form-field">
        <label htmlFor="bk-extra">Extra Charges</label>
        <input id="bk-extra" type="number" step="0.01" value={extraCharges} onChange={(e) => setExtraCharges(e.target.value)} />
      </div>
      <div className="admin-form-field">
        <label htmlFor="bk-discount">Discount</label>
        <input id="bk-discount" type="number" step="0.01" value={discount} onChange={(e) => setDiscount(e.target.value)} />
      </div>
      <div className="admin-form-field">
        <label htmlFor="bk-total">Total Price</label>
        <input id="bk-total" type="number" step="0.01" value={totalPrice} onChange={(e) => setTotalPrice(e.target.value)} required />
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
