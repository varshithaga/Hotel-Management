import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="logo" style={{ color: '#fff' }}>
              Grand<span>eur</span>
            </Link>
            <p>A sanctuary of luxury and comfort in the heart of the city. Experience hospitality redefined.</p>
            <div className="footer-social">
              <a href="#"><i className="fa-brands fa-facebook-f"></i></a>
              <a href="#"><i className="fa-brands fa-instagram"></i></a>
              <a href="#"><i className="fa-brands fa-twitter"></i></a>
              <a href="#"><i className="fa-brands fa-linkedin-in"></i></a>
            </div>
          </div>
          <div>
            <h5>Explore</h5>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/rooms">Rooms &amp; Suites</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/gallery">Gallery</Link></li>
            </ul>
          </div>
          <div>
            <h5>Guest Services</h5>
            <ul>
              <li><Link to="/booking">Book a Room</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><a href="#">Spa &amp; Wellness</a></li>
              <li><a href="#">Dining</a></li>
            </ul>
          </div>
          <div>
            <h5>Contact Info</h5>
            <ul>
              <li><i className="fa-solid fa-location-dot"></i>&nbsp; 123 Grandeur Avenue, Metropolis</li>
              <li><i className="fa-solid fa-phone"></i>&nbsp; +1 (555) 123-4567</li>
              <li><i className="fa-solid fa-envelope"></i>&nbsp; info@grandeurhotel.com</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>&copy; 2026 Grandeur Hotel. All rights reserved.</span>
          <span>
            <Link to="/admin/login">Admin Login</Link>
          </span>
          <span>Designed with &hearts; for unforgettable stays</span>
        </div>
      </div>
    </footer>
  );
}
