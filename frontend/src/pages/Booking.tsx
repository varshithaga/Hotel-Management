import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { todayISODate } from '../utils/date';
import {
  getRooms,
  getAvailability,
  roomImageUrl,
  type PublicRoom,
  type Availability,
} from '../api/public';

const DEFAULT_NIGHTS = 3;
const TAX_RATE = 0.1;

export default function Booking() {
  const minDate = todayISODate();
  const [searchParams] = useSearchParams();

  const [rooms, setRooms] = useState<PublicRoom[]>([]);
  const [roomsError, setRoomsError] = useState(false);

  const [roomId, setRoomId] = useState('');
  const [checkIn, setCheckIn] = useState(searchParams.get('check_in') ?? '');
  const [checkOut, setCheckOut] = useState(searchParams.get('check_out') ?? '');
  const [guests, setGuests] = useState(searchParams.get('guests') ?? '2');

  const [availability, setAvailability] = useState<Availability | null>(null);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);

  const [submitted, setSubmitted] = useState(false);

  // Load the full active-room list once.
  useEffect(() => {
    let active = true;
    getRooms()
      .then((data) => {
        if (!active) return;
        setRooms(data);
        const requested = searchParams.get('room');
        const initial =
          (requested && data.find((r) => String(r.id) === requested)) || data[0];
        if (initial) setRoomId(String(initial.id));
      })
      .catch(() => active && setRoomsError(true));
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-check availability whenever the date range changes.
  useEffect(() => {
    if (!checkIn || !checkOut || checkOut <= checkIn) {
      setAvailability(null);
      setAvailabilityError(null);
      return;
    }
    let active = true;
    setAvailabilityLoading(true);
    setAvailabilityError(null);
    getAvailability({
      checkIn,
      checkOut,
      guests: Number(guests.replace(/\D/g, '')) || undefined,
    })
      .then((data) => {
        if (!active) return;
        setAvailability(data);
        // If the currently selected room is not available, switch to the first that is.
        if (roomId && !data.available_rooms.some((r) => String(r.id) === roomId)) {
          setRoomId(data.available_rooms[0] ? String(data.available_rooms[0].id) : roomId);
        }
      })
      .catch(() => {
        if (active) setAvailabilityError('Could not check availability. Please try again.');
      })
      .finally(() => {
        if (active) setAvailabilityLoading(false);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkIn, checkOut, guests]);

  const availableIds = useMemo(
    () => new Set((availability?.available_rooms ?? []).map((r) => String(r.id))),
    [availability],
  );

  const selectedRoom =
    rooms.find((r) => String(r.id) === roomId) ?? rooms[0] ?? null;

  const nights = useMemo(() => {
    if (availability) return availability.nights;
    if (!checkIn || !checkOut) return DEFAULT_NIGHTS;
    const diff = Math.round(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000,
    );
    return diff > 0 ? diff : DEFAULT_NIGHTS;
  }, [availability, checkIn, checkOut]);

  const roomRate = selectedRoom?.price_per_night ?? 0;
  const subtotal = roomRate * nights;
  const taxes = Math.round(subtotal * TAX_RATE);
  const total = subtotal + taxes;

  const selectedIsAvailable =
    !availability || !roomId || availableIds.has(roomId);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    window.setTimeout(() => setSubmitted(false), 6000);
  };

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Reserve Your Stay</span>
          <h1>Book a Room</h1>
          <p className="breadcrumb"><Link to="/">Home</Link> / Book Now</p>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="booking-page-wrap">
            <div className="booking-form-card">
              {submitted && (
                <div className="form-success show">
                  Thank you for your reservation request! Our team will confirm your booking by email shortly.
                </div>
              )}

              <h3 style={{ color: '#10202f', fontSize: '1.6rem', marginBottom: 8 }}>Reservation Details</h3>
              <p style={{ color: '#6b6b6b', marginBottom: 30, fontSize: '0.92rem' }}>
                Pick your dates and we'll check live room availability for you.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Check-In Date</label>
                    <input
                      type="date"
                      min={minDate}
                      required
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Check-Out Date</label>
                    <input
                      type="date"
                      min={checkIn || minDate}
                      required
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Guests</label>
                    <select value={guests} onChange={(e) => setGuests(e.target.value)}>
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4+ Guests</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Room</label>
                    <select value={roomId} onChange={(e) => setRoomId(e.target.value)} required>
                      {rooms.length === 0 && <option value="">No rooms available</option>}
                      {rooms.map((room) => {
                        const unavailable = availability != null && !availableIds.has(String(room.id));
                        return (
                          <option value={room.id} key={room.id} disabled={unavailable}>
                            {room.name} &mdash; ${room.price_per_night}/night
                            {room.room_type_name ? ` (${room.room_type_name})` : ''}
                            {unavailable ? ' — booked' : ''}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                <div className="availability-status">
                  {roomsError && (
                    <p className="section-status-error">Room information is unavailable right now.</p>
                  )}
                  {availabilityLoading && <p>Checking availability…</p>}
                  {availabilityError && <p className="section-status-error">{availabilityError}</p>}
                  {availability && !availabilityLoading && !availabilityError && (
                    <p>
                      <strong>{availability.count}</strong> room{availability.count === 1 ? '' : 's'} available
                      for {availability.nights} night{availability.nights === 1 ? '' : 's'}
                      {' '}({availability.check_in} → {availability.check_out}).
                      {!selectedIsAvailable && ' The room you picked is booked for those dates — choose another.'}
                    </p>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" placeholder="Your name" required />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" placeholder="you@example.com" required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input type="tel" placeholder="+1 (555) 000-0000" required />
                  </div>
                  <div className="form-group">
                    <label>Special Requests</label>
                    <input type="text" placeholder="e.g. Late check-in, high floor" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={!selectedRoom || !selectedIsAvailable}
                >
                  {selectedIsAvailable ? 'Confirm Reservation' : 'Room Unavailable for These Dates'}
                </button>
                <p className="form-note">
                  Availability is checked live against current reservations. Final confirmation is sent by our team.
                </p>
              </form>
            </div>

            <aside className="booking-summary">
              <h3>Booking Summary</h3>
              {selectedRoom ? (
                <>
                  <div className="summary-room">
                    <img src={roomImageUrl(selectedRoom)} alt={selectedRoom.name} />
                    <div>
                      <h5>{selectedRoom.name}</h5>
                      <span>{selectedRoom.room_type_name ?? `${selectedRoom.capacity ?? 2} guests`}</span>
                    </div>
                  </div>
                  <div className="summary-line"><span>Room Rate</span><span>${roomRate} / night</span></div>
                  <div className="summary-line"><span>Nights</span><span>{nights}</span></div>
                  <div className="summary-line"><span>Taxes &amp; Fees</span><span>${taxes}</span></div>
                  <div className="summary-total"><span>Total</span><span>${total.toLocaleString()}</span></div>
                </>
              ) : (
                <p className="section-status">Select a room to see pricing.</p>
              )}
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
