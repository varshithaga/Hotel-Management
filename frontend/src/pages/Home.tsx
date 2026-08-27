import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { amenities } from '../data/amenities';
import RoomCard from '../components/RoomCard';
import TestimonialSlider from '../components/TestimonialSlider';
import { todayISODate } from '../utils/date';
import { getRooms, getRoomTypes, toDisplayRoom, type PublicRoom, type RoomType } from '../api/public';

export default function Home() {
  const navigate = useNavigate();
  const minDate = todayISODate();

  const [rooms, setRooms] = useState<PublicRoom[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [roomsError, setRoomsError] = useState(false);

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');
  const [roomTypeId, setRoomTypeId] = useState('');

  useEffect(() => {
    let active = true;
    getRooms()
      .then((data) => active && setRooms(data))
      .catch(() => active && setRoomsError(true));
    getRoomTypes()
      .then((data) => active && setRoomTypes(data))
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  const featuredRooms = useMemo(() => rooms.slice(0, 3), [rooms]);

  const handleCheckAvailability = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (checkIn) params.set('check_in', checkIn);
    if (checkOut) params.set('check_out', checkOut);
    if (guests) params.set('guests', guests.replace(/\D/g, '') || '1');
    if (roomTypeId) params.set('room_type_id', roomTypeId);
    navigate(`/booking?${params.toString()}`);
  };

  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <span className="eyebrow">Welcome to Grandeur Hotel</span>
            <h1>An Address of <em>Timeless</em> Luxury</h1>
            <p>
              Nestled in the heart of the city, Grandeur Hotel blends refined elegance with warm
              hospitality &mdash; the perfect escape for travelers who expect nothing less than
              extraordinary.
            </p>
            <div className="hero-btns">
              <Link to="/booking" className="btn btn-primary">Reserve Your Stay</Link>
              <Link to="/rooms" className="btn btn-outline">Explore Rooms</Link>
            </div>
          </div>
        </div>
        <div className="hero-scroll">Scroll</div>
      </section>

      <div className="booking-strip">
        <div className="container">
          <form className="booking-card" onSubmit={handleCheckAvailability}>
            <div className="booking-field">
              <label>Check In</label>
              <input
                type="date"
                min={minDate}
                required
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>
            <div className="booking-field">
              <label>Check Out</label>
              <input
                type="date"
                min={checkIn || minDate}
                required
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>
            <div className="booking-field">
              <label>Guests</label>
              <select value={guests} onChange={(e) => setGuests(e.target.value)}>
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4">4+ Guests</option>
              </select>
            </div>
            <div className="booking-field">
              <label>Room Type</label>
              <select value={roomTypeId} onChange={(e) => setRoomTypeId(e.target.value)}>
                <option value="">Any Room Type</option>
                {roomTypes.map((rt) => (
                  <option value={rt.id} key={rt.id}>{rt.name}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary">Check Availability</button>
          </form>
        </div>
      </div>

      <section className="about-section">
        <div className="container">
          <div className="about-images">
            <img className="img-tall" src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=700&q=80" alt="Hotel lobby interior" />
            <img className="img-small" src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=500&q=80" alt="Hotel pool" />
            <img className="img-small" src="https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=500&q=80" alt="Hotel room" />
            <div className="about-badge"><strong>25+</strong><span>Years of Excellence</span></div>
          </div>
          <div className="about-text">
            <span className="eyebrow">Why Choose Us</span>
            <h2>Experience Comfort Wrapped in Elegance</h2>
            <p>
              From the moment you arrive, our dedicated team ensures every detail of your stay is
              thoughtfully curated &mdash; combining classic sophistication with modern comfort.
            </p>
            <ul className="about-list">
              <li><span className="check"><i className="fa-solid fa-check"></i></span> Award-winning fine dining restaurants</li>
              <li><span className="check"><i className="fa-solid fa-check"></i></span> Rooftop infinity pool &amp; wellness spa</li>
              <li><span className="check"><i className="fa-solid fa-check"></i></span> 24/7 concierge &amp; valet service</li>
              <li><span className="check"><i className="fa-solid fa-check"></i></span> Prime location near city landmarks</li>
            </ul>
            <Link to="/about" className="btn btn-dark">Discover Our Story</Link>
          </div>
        </div>
      </section>

      <section className="amenities">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Hotel Amenities</span>
            <h2>Everything You Need for a Perfect Stay</h2>
            <p>Indulge in world-class facilities designed for your comfort, relaxation, and unforgettable memories.</p>
          </div>
          <div className="amenity-grid">
            {amenities.map((a) => (
              <div className="amenity-card" key={a.id}>
                <div className="amenity-icon"><i className={a.icon}></i></div>
                <h4>{a.title}</h4>
                <p>{a.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rooms-section">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Accommodations</span>
            <h2>Our Featured Rooms &amp; Suites</h2>
            <p>Each room is thoughtfully designed to offer the ultimate blend of comfort, style, and tranquility.</p>
          </div>
          {featuredRooms.length > 0 ? (
            <div className="rooms-grid">
              {featuredRooms.map((room) => (
                <RoomCard room={toDisplayRoom(room, room.is_it_reserved)} key={room.id} />
              ))}
            </div>
          ) : (
            <p className="section-status">
              {roomsError ? 'Room information is unavailable right now.' : 'Loading featured rooms…'}
            </p>
          )}
          <div className="section-footer-cta">
            <Link to="/rooms" className="btn btn-outline" style={{ color: '#10202f', borderColor: '#10202f' }}>
              View All Rooms
            </Link>
          </div>
        </div>
      </section>

      <div className="stats-bar">
        <div className="container">
          <div className="stats-grid">
            <div><strong>25+</strong><span>Years of Service</span></div>
            <div><strong>120</strong><span>Luxury Rooms</span></div>
            <div><strong>15k+</strong><span>Happy Guests</span></div>
            <div><strong>40+</strong><span>Awards Won</span></div>
          </div>
        </div>
      </div>

      <section className="testimonials">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Guest Experiences</span>
            <h2>What Our Guests Say</h2>
            <p>Real stories from travelers who made Grandeur Hotel their home away from home.</p>
          </div>
          <TestimonialSlider />
        </div>
      </section>

      <section className="cta-band">
        <div className="container">
          <h2>Ready for an Unforgettable Stay?</h2>
          <p>Book directly with us and enjoy exclusive rates, complimentary breakfast, and flexible cancellation.</p>
          <Link to="/booking" className="btn btn-primary">Book Your Room Today</Link>
        </div>
      </section>
    </>
  );
}
