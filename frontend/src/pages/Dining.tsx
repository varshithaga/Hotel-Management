import { Link } from 'react-router-dom';
import { diningVenues } from '../data/dining';

export default function Dining() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Dining</span>
          <h1>Restaurants &amp; Bars</h1>
          <p className="breadcrumb"><Link to="/">Home</Link> / Dining</p>
        </div>
      </section>

      <section className="rooms-section">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Five Ways to Dine</span>
            <h2>From Tasting Menus to Late-Night Bites</h2>
            <p>Every venue is open to hotel guests and visitors alike. Reservations recommended for Azure and Saffron.</p>
          </div>

          <div className="gallery-grid">
            {diningVenues.map((v) => (
              <div className="gallery-item wide" key={v.id}>
                <img src={v.image} alt={v.name} />
                <div className="gallery-overlay">
                  <span>{v.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="amenities">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">The Venues</span>
            <h2>Where &amp; When</h2>
            <p>Opening hours may vary on public holidays &mdash; the concierge has the latest.</p>
          </div>
          <div className="amenity-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
            {diningVenues.map((v) => (
              <div className="amenity-card" style={{ background: '#f4f8fa', borderColor: '#e2edf1' }} key={v.id}>
                <div className="amenity-icon" style={{ color: '#0E7490' }}><i className={v.icon}></i></div>
                <h4 style={{ color: '#082F49' }}>{v.name}</h4>
                <p style={{ color: '#0E7490', fontWeight: 600, marginBottom: 6 }}>{v.cuisine}</p>
                <p style={{ color: '#082F49', fontSize: '0.85rem', marginBottom: 6 }}>{v.hours}</p>
                <p style={{ color: '#5b6b76' }}>{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="container">
          <h2>Hungry Already?</h2>
          <p>Book your stay and we&apos;ll have a table waiting.</p>
          <Link to="/booking" className="btn btn-primary">Book Now</Link>
        </div>
      </section>
    </>
  );
}
