import { useEffect, useState } from 'react';
import { testimonials } from '../data/testimonials';

const AUTO_ADVANCE_MS = 6000;

export default function TestimonialSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(timer);
  }, [index]);

  return (
    <>
      <div className="testimonial-track" style={{ transform: `translateX(-${index * 100}%)` }}>
        {testimonials.map((t) => (
          <div className="testimonial-card" key={t.id}>
            <div className="testimonial-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
            <p className="quote">&ldquo;{t.quote}&rdquo;</p>
            <div className="testimonial-author">
              <img src={t.avatar} alt={t.name} />
              <div>
                <h5>{t.name}</h5>
                <span>{t.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="testimonial-dots">
        {testimonials.map((t, i) => (
          <div
            key={t.id}
            className={`dot${i === index ? ' active' : ''}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </>
  );
}
