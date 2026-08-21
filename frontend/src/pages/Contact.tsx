import { Link } from 'react-router-dom';
import { useDemoForm } from '../hooks/useDemoForm';

export default function Contact() {
  const { formRef, successRef, submitted, handleSubmit } = useDemoForm();

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Get In Touch</span>
          <h1>Contact Us</h1>
          <p className="breadcrumb"><Link to="/">Home</Link> / Contact</p>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="contact-wrap">
            <div className="contact-info-card">
              <h3>Let's Start a Conversation</h3>
              <p>Have a question about your stay, a special event, or group bookings? Our team is here to help, any time.</p>

              <div className="contact-item">
                <i className="fa-solid fa-location-dot"></i>
                <div><h5>Our Location</h5><p>123 Grandeur Avenue, Metropolis, MP 10001</p></div>
              </div>
              <div className="contact-item">
                <i className="fa-solid fa-phone"></i>
                <div><h5>Phone Number</h5><p><a href="tel:+15551234567">+1 (555) 123-4567</a></p></div>
              </div>
              <div className="contact-item">
                <i className="fa-solid fa-envelope"></i>
                <div><h5>Email Address</h5><p><a href="mailto:info@grandeurhotel.com">info@grandeurhotel.com</a></p></div>
              </div>
              <div className="contact-item">
                <i className="fa-solid fa-clock"></i>
                <div><h5>Front Desk</h5><p>Open 24 hours a day, 7 days a week</p></div>
              </div>

              <div className="social-row">
                <a href="#"><i className="fa-brands fa-facebook-f"></i></a>
                <a href="#"><i className="fa-brands fa-instagram"></i></a>
                <a href="#"><i className="fa-brands fa-twitter"></i></a>
                <a href="#"><i className="fa-brands fa-linkedin-in"></i></a>
              </div>
            </div>

            <div>
              <div className="contact-form">
                <div className={`form-success${submitted ? ' show' : ''}`} ref={successRef}>
                  Thank you! Your message has been received &mdash; our team will reach out shortly. (Demo form &mdash; no data is sent yet.)
                </div>
                <form ref={formRef} onSubmit={handleSubmit}>
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
                      <input type="tel" placeholder="+1 (555) 000-0000" />
                    </div>
                    <div className="form-group">
                      <label>Subject</label>
                      <select>
                        <option>General Inquiry</option>
                        <option>Room Reservation</option>
                        <option>Event &amp; Weddings</option>
                        <option>Feedback</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Message</label>
                    <textarea placeholder="Tell us how we can help..." required></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary btn-block">Send Message</button>
                  <p className="form-note">This is a front-end demo form. No message data is transmitted or stored.</p>
                </form>
              </div>

              <div className="map-embed">
                <i className="fa-solid fa-map-location-dot"></i>
                <span>Map preview placeholder &mdash; 123 Grandeur Avenue, Metropolis</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
