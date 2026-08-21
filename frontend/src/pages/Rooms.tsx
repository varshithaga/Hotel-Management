import { Link } from 'react-router-dom';
import { rooms } from '../data/rooms';
import RoomCard from '../components/RoomCard';

export default function Rooms() {
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
          <div className="rooms-grid">
            {rooms.map((room) => (
              <RoomCard room={room} showWifi key={room.id} />
            ))}
          </div>
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
