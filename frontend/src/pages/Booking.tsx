import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { rooms } from '../data/rooms';
import { useDemoForm } from '../hooks/useDemoForm';
import { todayISODate } from '../utils/date';

const DEFAULT_ROOM_ID = 'executive-suite';
const DEFAULT_NIGHTS = 3;
const TAX_RATE = 0.1;

export default function Booking() {
  const { formRef, successRef, submitted, handleSubmit } = useDemoForm();
  const minDate = todayISODate();

  const [roomId, setRoomId] = useState(DEFAULT_ROOM_ID);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  const selectedRoom = rooms.find((r) => r.id === roomId) ?? rooms.find((r) => r.id === DEFAULT_ROOM_ID)!;

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return DEFAULT_NIGHTS;
    const diff = Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000);
    return diff > 0 ? diff : DEFAULT_NIGHTS;
  }, [checkIn, checkOut]);

  const subtotal = selectedRoom.price * nights;
  const taxes = Math.round(subtotal * TAX_RATE);
  const total = subtotal + taxes;

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
              <div className={`form-success${submitted ? ' show' : ''}`} ref={successRef}>
                Thank you for your reservation request! A confirmation email will be sent shortly. (Demo form &mdash; no data is sent yet.)
              </div>
              <h3 style={{ color: '#10202f', fontSize: '1.6rem', marginBottom: 8 }}>Reservation Details</h3>
              <p style={{ color: '#6b6b6b', marginBottom: 30, fontSize: '0.92rem' }}>
                Fill in your details below and our reservations team will confirm availability.
              </p>
              <form ref={formRef} onSubmit={handleSubmit}>
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
                    <select defaultValue="2 Guests">
                      <option>1 Guest</option>
                      <option>2 Guests</option>
                      <option>3 Guests</option>
                      <option>4+ Guests</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Room Type</label>
                    <select value={roomId} onChange={(e) => setRoomId(e.target.value)}>
                      {rooms.map((room) => (
                        <option value={room.id} key={room.id}>
                          {room.name} &mdash; ${room.price}/night
                        </option>
                      ))}
                    </select>
                  </div>
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
                <button type="submit" className="btn btn-primary btn-block">Confirm Reservation</button>
                <p className="form-note">This is a front-end demo form. No booking data is transmitted or stored &mdash; a backend will be connected later.</p>
              </form>
            </div>

            <aside className="booking-summary">
              <h3>Booking Summary</h3>
              <div className="summary-room">
                <img src={selectedRoom.image} alt={selectedRoom.name} />
                <div>
                  <h5>{selectedRoom.name}</h5>
                  <span>{selectedRoom.bed}</span>
                </div>
              </div>
              <div className="summary-line"><span>Room Rate</span><span>${selectedRoom.price} / night</span></div>
              <div className="summary-line"><span>Nights</span><span>{nights}</span></div>
              <div className="summary-line"><span>Taxes &amp; Fees</span><span>${taxes}</span></div>
              <div className="summary-total"><span>Total</span><span>${total.toLocaleString()}</span></div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
