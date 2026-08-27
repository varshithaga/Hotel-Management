import { Link } from 'react-router-dom';
import { team } from '../data/team';

const values = [
  { id: 'care', icon: 'fa-solid fa-heart', title: 'Genuine Care', text: 'Every guest is treated like family, with service that feels personal, not transactional.' },
  { id: 'quality', icon: 'fa-solid fa-gem', title: 'Uncompromising Quality', text: 'From linens to cuisine, we hold every detail to the highest standard.' },
  { id: 'sustainability', icon: 'fa-solid fa-leaf', title: 'Sustainable Luxury', text: "We're committed to eco-conscious practices without compromising comfort." },
];

export default function About() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Our Story</span>
          <h1>About Grandeur Hotel</h1>
          <p className="breadcrumb"><Link to="/">Home</Link> / About</p>
        </div>
      </section>

      <section className="about-section">
        <div className="container">
          <div className="about-images">
            <img className="img-tall" src="https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=700&q=80" alt="Hotel exterior" />
            <img className="img-small" src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=500&q=80" alt="Hotel dining" />
            <img className="img-small" src="https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=500&q=80" alt="Hotel bedroom" />
            <div className="about-badge"><strong>40+</strong><span>Awards Won</span></div>
          </div>
          <div className="about-text">
            <span className="eyebrow">Since 2001</span>
            <h2>A Legacy Built on Genuine Hospitality</h2>
            <p>
              Grandeur Hotel opened its doors over two decades ago with a simple mission: to create
              a home away from home where every guest feels truly valued. What began as a single
              boutique property has grown into a landmark destination, while never losing the
              personal touch that defined us from day one.
            </p>
            <p>
              Today, our team of passionate hospitality professionals continues that tradition
              &mdash; blending timeless elegance, modern comforts, and heartfelt service to craft
              experiences our guests remember long after they check out.
            </p>
            <Link to="/booking" className="btn btn-dark">Book Your Stay</Link>
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

      <section className="rooms-section">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Our Values</span>
            <h2>What Guides Everything We Do</h2>
            <p>Three principles shape every interaction, every detail, and every stay at Grandeur Hotel.</p>
          </div>
          <div className="amenity-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
            {values.map((v) => (
              <div className="amenity-card" style={{ background: '#f4f8fa', borderColor: '#e2edf1' }} key={v.id}>
                <div className="amenity-icon" style={{ color: '#0E7490' }}><i className={v.icon}></i></div>
                <h4 style={{ color: '#082F49' }}>{v.title}</h4>
                <p style={{ color: '#5b6b76' }}>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="amenities">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Meet The Team</span>
            <h2>The People Behind Your Experience</h2>
            <p>Our leadership team brings decades of combined hospitality expertise to every stay.</p>
          </div>
          <div className="team-grid">
            {team.map((member) => (
              <div className="team-card" key={member.id}>
                <div className="team-photo"><img src={member.photo} alt={member.role} /></div>
                <h4 style={{ color: '#fff' }}>{member.name}</h4>
                <span>{member.role}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="container">
          <h2>Come Experience It Yourself</h2>
          <p>Words only say so much &mdash; the Grandeur difference is best felt in person.</p>
          <Link to="/booking" className="btn btn-primary">Plan Your Visit</Link>
        </div>
      </section>
    </>
  );
}
