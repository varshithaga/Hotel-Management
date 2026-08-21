# Grandeur Hotel — Frontend

React + TypeScript rebuild of the Grandeur Hotel marketing site (Vite).

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — type-check and build for production
- `npm run preview` — preview the production build
- `npm run lint` — lint the source

## Structure

- `src/pages` — one component per route (Home, Rooms, About, Gallery, Contact, Booking)
- `src/components` — shared UI (Navbar, Footer, room cards, testimonial slider, etc.)
- `src/data` — static content (rooms, amenities, team, testimonials, gallery)
- `src/hooks` — scroll and demo-form behavior
- `src/styles/style.css` — global stylesheet (ported from the original site)

All booking/contact forms are front-end demos only — no data is sent to a backend yet.
