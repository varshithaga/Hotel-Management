import { useEffect, useState, type FormEvent } from "react";
import { createRoom } from "./api";
import { getFloorList, type Floor } from "../Floors/api";
import { getRoomTypeList, type RoomType } from "../RoomTypes/api";

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AddRoom({ onSuccess, onCancel }: Props) {
  const [floors, setFloors] = useState<Floor[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [floorId, setFloorId] = useState("");
  const [roomTypeId, setRoomTypeId] = useState("");
  const [name, setName] = useState("");
  const [pricePerNight, setPricePerNight] = useState("");
  const [capacity, setCapacity] = useState("");
  const [noOfBeds, setNoOfBeds] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getFloorList(1, "all").then((res) => setFloors(res.results));
    getRoomTypeList(1, "all").then((res) => setRoomTypes(res.results));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await createRoom({
        floor_id: Number(floorId),
        room_type_id: Number(roomTypeId),
        name,
        price_per_night: Number(pricePerNight),
        capacity: capacity ? Number(capacity) : undefined,
        no_of_beds: noOfBeds ? Number(noOfBeds) : undefined,
        description,
        is_active: isActive,
      });
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to create room");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="admin-form-error">{error}</div>}
      <div className="admin-form-field">
        <label htmlFor="room-floor">Floor</label>
        <select id="room-floor" value={floorId} onChange={(e) => setFloorId(e.target.value)} required>
          <option value="">Select floor</option>
          {floors.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
      </div>
      <div className="admin-form-field">
        <label htmlFor="room-type">Room Type</label>
        <select id="room-type" value={roomTypeId} onChange={(e) => setRoomTypeId(e.target.value)} required>
          <option value="">Select room type</option>
          {roomTypes.map((rt) => (
            <option key={rt.id} value={rt.id}>
              {rt.name}
            </option>
          ))}
        </select>
      </div>
      <div className="admin-form-field">
        <label htmlFor="room-name">Name</label>
        <input id="room-name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="admin-form-field">
        <label htmlFor="room-price">Price / Night</label>
        <input
          id="room-price"
          type="number"
          step="0.01"
          value={pricePerNight}
          onChange={(e) => setPricePerNight(e.target.value)}
          required
        />
      </div>
      <div className="admin-form-field">
        <label htmlFor="room-capacity">Capacity</label>
        <input id="room-capacity" type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
      </div>
      <div className="admin-form-field">
        <label htmlFor="room-beds">No. of Beds</label>
        <input id="room-beds" type="number" value={noOfBeds} onChange={(e) => setNoOfBeds(e.target.value)} />
      </div>
      <div className="admin-form-field">
        <label htmlFor="room-description">Description</label>
        <textarea id="room-description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className="admin-form-field admin-form-field-checkbox">
        <input id="room-active" type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
        <label htmlFor="room-active">Active</label>
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
