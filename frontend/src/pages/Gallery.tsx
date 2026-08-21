import { Link } from 'react-router-dom';
import { galleryItems } from '../data/gallery';

function sizeClass(size?: 'wide' | 'tall' | 'wide-tall') {
  if (size === 'wide-tall') return ' wide tall';
  if (size === 'wide') return ' wide';
  if (size === 'tall') return ' tall';
  return '';
}

export default function Gallery() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Visual Tour</span>
          <h1>Gallery</h1>
          <p className="breadcrumb"><Link to="/">Home</Link> / Gallery</p>
        </div>
      </section>

      <section className="rooms-section">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Take a Look Inside</span>
            <h2>Moments Captured at Grandeur</h2>
            <p>Explore our elegant interiors, luxurious rooms, and inviting spaces through the lens.</p>
          </div>

          <div className="gallery-grid">
            {galleryItems.map((item) => (
              <div className={`gallery-item${sizeClass(item.size)}`} key={item.id}>
                <img src={item.image} alt={item.label} />
                <div className="gallery-overlay"><span>{item.label}</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="container">
          <h2>Ready to See It in Person?</h2>
          <p>Reserve your stay and experience the Grandeur difference firsthand.</p>
          <Link to="/booking" className="btn btn-primary">Book Now</Link>
        </div>
      </section>
    </>
  );
}
