import { Link } from 'react-router-dom';
import { spaFacilities, spaTreatments } from '../data/spa';

export default function Spa() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Spa &amp; Wellness</span>
          <h1>The Grandeur Spa</h1>
          <p className="breadcrumb"><Link to="/">Home</Link> / Spa &amp; Wellness</p>
        </div>
      </section>

      <section className="about-section">
        <div className="container">
          <div className="about-images">
            <img className="img-tall" src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=700&q=80" alt="Spa treatment room" />
            <img className="img-small" src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=500&q=80" alt="Massage therapy" />
            <img className="img-small" src="https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=500&q=80" alt="Relaxation lounge" />
            <div className="about-badge"><strong>2,000</strong><span>sq ft of calm</span></div>
          </div>
          <div className="about-text">
            <span className="eyebrow">Restore &amp; Rebalance</span>
            <h2>A Quiet Retreat Above the City</h2>
            <p>
              Set on our seventh floor, the Grandeur Spa is a hushed world of warm stone, soft light
              and expert hands. Every journey begins with a short consultation so your therapist can
              tailor pressure, aromas and pace to exactly what your body needs that day.
            </p>
            <p>
              Arrive an hour early to move between the sauna, steam room and vitality pool &mdash;
              spa guests enjoy full use of the thermal suite with every treatment.
            </p>
            <Link to="/contact" className="btn btn-dark">Request a Booking</Link>
          </div>
        </div>
      </section>

      <section className="rooms-section">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Signature Treatments</span>
            <h2>Massages, Facials &amp; Rituals</h2>
            <p>Prices are per person. Add the thermal suite to any treatment at no extra charge.</p>
          </div>
          <div className="amenity-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
            {spaTreatments.map((t) => (
              <div className="amenity-card" style={{ background: '#f4f8fa', borderColor: '#e2edf1' }} key={t.id}>
                <div className="amenity-icon" style={{ color: '#0E7490' }}><i className={t.icon}></i></div>
                <h4 style={{ color: '#082F49' }}>{t.name}</h4>
                <p style={{ color: '#0E7490', fontWeight: 600, marginBottom: 6 }}>{t.duration} &middot; ${t.price}</p>
                <p style={{ color: '#5b6b76' }}>{t.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="amenities">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Facilities</span>
            <h2>Included With Every Visit</h2>
            <p>Everything you need for an unhurried half-day of quiet.</p>
          </div>
          <div className="amenity-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
            {spaFacilities.map((f) => (
              <div className="amenity-card" key={f}>
                <div className="amenity-icon" style={{ color: '#0E7490' }}><i className="fa-solid fa-check"></i></div>
                <p style={{ color: '#5b6b76' }}>{f}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="container">
          <h2>Make Time for Yourself</h2>
          <p>Reserve a treatment alongside your stay and let us take care of the rest.</p>
          <Link to="/booking" className="btn btn-primary">Plan Your Visit</Link>
        </div>
      </section>
    </>
  );
}
