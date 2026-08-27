import { Link } from "react-router-dom";
import { getCurrentUser } from "../access/access";

const sections = [
  { to: "/admin/floors", title: "Floors", desc: "Building floors & wings" },
  { to: "/admin/room-types", title: "Room Types", desc: "Categories & descriptions" },
  { to: "/admin/amenities", title: "Amenities", desc: "In-room facilities" },
  { to: "/admin/rooms", title: "Rooms", desc: "Inventory, pricing, status" },
  { to: "/admin/reservations", title: "Reservations", desc: "Upcoming guest holds" },
  { to: "/admin/bookings", title: "Bookings", desc: "Confirmed stays" },
  { to: "/admin/payments", title: "Payments", desc: "Transactions & status" },
  { to: "/admin/reviews", title: "Reviews", desc: "Guest ratings" },
  { to: "/admin/contacts", title: "Contact Forms", desc: "Enquiries from the site" },
  { to: "/admin/feedbacks", title: "Feedback", desc: "Guest suggestions" },
  { to: "/admin/departments", title: "Departments", desc: "Operational teams" },
  { to: "/admin/staff-roles", title: "Staff Roles", desc: "Job titles" },
  { to: "/admin/employees", title: "Employees", desc: "Team directory" },
  { to: "/admin/work-types", title: "Work Types", desc: "Maintenance categories" },
  { to: "/admin/work-assignments", title: "Work Assignments", desc: "Scheduled jobs" },
  { to: "/admin/users", title: "Users", desc: "Admin & staff accounts" },
];

export default function Dashboard() {
  const user = getCurrentUser();

  return (
    <div>
      <div className="admin-dash-welcome">
        <h2>Welcome{user ? `, ${user.full_name}` : ""}</h2>
        <p>Manage every part of the hotel from here. Pick a section to get started.</p>
      </div>

      <div className="admin-dash-grid">
        {sections.map((s) => (
          <Link key={s.to} to={s.to} className="admin-dash-card">
            <strong>{s.title}</strong>
            <span>{s.desc}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
