import { useEffect, useState, type FormEvent } from "react";
import { updateRoom, type Room } from "./api";
import { getFloorList, type Floor } from "../Floors/api";
import { getRoomTypeList, type RoomType } from "../RoomTypes/api";

interface Props {
  room: Room;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function EditRoom({ room, onSuccess, onCancel }: Props) {
  const [floors, setFloors] = useState<Floor[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [floorId, setFloorId] = useState(String(room.floor_id));
  const [roomTypeId, setRoomTypeId] = useState(String(room.room_type_id));
  const [name, setName] = useState(room.name);
  const [pricePerNight, setPricePerNight] = useState(String(room.price_per_night));
  const [capacity, setCapacity] = useState(room.capacity != null ? String(room.capacity) : "");
  const [noOfBeds, setNoOfBeds] = useState(room.no_of_beds != null ? String(room.no_of_beds) : "");
  const [description, setDescription] = useState(room.description ?? "");
  const [isActive, setIsActive] = useState(room.is_active ?? true);
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
      await updateRoom(room.id!, {
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
      setError(err?.response?.data?.detail || "Failed to update room");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="admin-form-error">{error}</div>}
      <div className="admin-form-field">
        <label htmlFor="edit-room-floor">Floor</label>
        <select id="edit-room-floor" value={floorId} onChange={(e) => setFloorId(e.target.value)} required>
          {floors.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
      </div>
      <div className="admin-form-field">
        <label htmlFor="edit-room-type">Room Type</label>
        <select id="edit-room-type" value={roomTypeId} onChange={(e) => setRoomTypeId(e.target.value)} required>
          {roomTypes.map((rt) => (
            <option key={rt.id} value={rt.id}>
              {rt.name}
            </option>
          ))}
        </select>
      </div>
      <div className="admin-form-field">
        <label htmlFor="edit-room-name">Name</label>
        <input id="edit-room-name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="admin-form-field">
        <label htmlFor="edit-room-price">Price / Night</label>
        <input
          id="edit-room-price"
          type="number"
          step="0.01"
          value={pricePerNight}
          onChange={(e) => setPricePerNight(e.target.value)}
          required
        />
      </div>
      <div className="admin-form-field">
        <label htmlFor="edit-room-capacity">Capacity</label>
        <input id="edit-room-capacity" type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
      </div>
      <div className="admin-form-field">
        <label htmlFor="edit-room-beds">No. of Beds</label>
        <input id="edit-room-beds" type="number" value={noOfBeds} onChange={(e) => setNoOfBeds(e.target.value)} />
      </div>
      <div className="admin-form-field">
        <label htmlFor="edit-room-description">Description</label>
        <textarea id="edit-room-description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className="admin-form-field admin-form-field-checkbox">
        <input
          id="edit-room-active"
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        />
        <label htmlFor="edit-room-active">Active</label>
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
