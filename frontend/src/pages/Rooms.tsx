import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import RoomCard from '../components/RoomCard';
import { getRooms, toDisplayRoom, type PublicRoom } from '../api/public';

export default function Rooms() {
  const [rooms, setRooms] = useState<PublicRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getRooms()
      .then((data) => {
        if (active) setRooms(data);
      })
      .catch(() => {
        if (active) setError('We could not load rooms right now. Please try again shortly.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Accommodations</span>
          <h1>Rooms &amp; Suites</h1>
          <p className="breadcrumb"><Link to="/">Home</Link> / Rooms &amp; Suites</p>
        </div>
      </section>

      <section className="rooms-section">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Find Your Perfect Stay</span>
            <h2>Choose From Our Signature Rooms</h2>
            <p>Every room is designed with meticulous attention to detail, blending comfort with sophisticated style.</p>
          </div>

          {loading && <p className="section-status">Loading rooms&hellip;</p>}
          {error && !loading && <p className="section-status section-status-error">{error}</p>}
          {!loading && !error && rooms.length === 0 && (
            <p className="section-status">No rooms are published yet. Please check back soon.</p>
          )}

          {!loading && !error && rooms.length > 0 && (
            <div className="rooms-grid">
              {rooms.map((room) => (
                <RoomCard room={toDisplayRoom(room, room.is_it_reserved)} showWifi key={room.id} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="cta-band">
        <div className="container">
          <h2>Can't Decide? Let Us Help.</h2>
          <p>Our reservations team can recommend the perfect room based on your preferences and occasion.</p>
          <Link to="/contact" className="btn btn-primary">Contact Reservations</Link>
        </div>
      </section>
    </>
  );
}
