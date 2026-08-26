import { useEffect, useState, type FormEvent } from "react";
import { createReservation } from "./api";
import { getRoomList, type Room } from "../Rooms/api";

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AddReservation({ onSuccess, onCancel }: Props) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [roomIds, setRoomIds] = useState<string[]>([]);
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
      await createReservation({
        user_name: userName,
        user_email: userEmail,
        user_phone: userPhone,
        reserved_check_in_date: checkIn,
        reserved_check_out_date: checkOut,
        total_price: Number(totalPrice),
        room_ids: roomIds.map(Number),
      });
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to create reservation");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="admin-form-error">{error}</div>}
      <div className="admin-form-field">
        <label htmlFor="res-name">Guest Name</label>
        <input id="res-name" value={userName} onChange={(e) => setUserName(e.target.value)} required />
      </div>
      <div className="admin-form-field">
        <label htmlFor="res-email">Guest Email</label>
        <input id="res-email" type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} required />
      </div>
      <div className="admin-form-field">
        <label htmlFor="res-phone">Guest Phone</label>
        <input id="res-phone" value={userPhone} onChange={(e) => setUserPhone(e.target.value)} required />
      </div>
      <div className="admin-form-field">
        <label htmlFor="res-checkin">Check-in</label>
        <input id="res-checkin" type="datetime-local" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} required />
      </div>
      <div className="admin-form-field">
        <label htmlFor="res-checkout">Check-out</label>
        <input id="res-checkout" type="datetime-local" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} required />
      </div>
      <div className="admin-form-field">
        <label htmlFor="res-price">Total Price</label>
        <input id="res-price" type="number" step="0.01" value={totalPrice} onChange={(e) => setTotalPrice(e.target.value)} required />
      </div>
      <div className="admin-form-field">
        <label htmlFor="res-rooms">Rooms</label>
        <select
          id="res-rooms"
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
