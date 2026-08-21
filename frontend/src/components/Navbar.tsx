import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useScrolled } from '../hooks/useScrolled';

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/rooms', label: 'Rooms & Suites' },
  { to: '/about', label: 'About' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const scrolled = useScrolled(40);
  const [open, setOpen] = useState(false);

  return (
    <header className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="container">
        <NavLink to="/" className="logo" onClick={() => setOpen(false)}>
          Grand<span>eur</span>
        </NavLink>
        <nav className={`nav-links${open ? ' open' : ''}`}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? 'active' : undefined)}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
          <NavLink to="/booking" className="nav-cta" onClick={() => setOpen(false)}>
            Book Now
          </NavLink>
        </nav>
        <button
          className={`nav-toggle${open ? ' active' : ''}`}
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}
