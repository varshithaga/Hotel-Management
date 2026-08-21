import { useScrolled } from '../hooks/useScrolled';

export default function BackToTop() {
  const show = useScrolled(500);

  return (
    <button
      className={`back-to-top${show ? ' show' : ''}`}
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <i className="fa-solid fa-arrow-up"></i>
    </button>
  );
}
