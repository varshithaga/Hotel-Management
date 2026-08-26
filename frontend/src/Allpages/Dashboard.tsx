import { getCurrentUser } from "../access/access";

export default function Dashboard() {
  const user = getCurrentUser();

  return (
    <div>
      <div className="admin-page-header">
        <h2>Welcome{user ? `, ${user.full_name}` : ""}</h2>
      </div>
      <p style={{ color: "#6b7280" }}>
        Use the sidebar to manage floors, room types, amenities, rooms, reservations, bookings, payments, reviews,
        contact forms, feedback, departments, staff roles, employees, work types, work assignments and users.
      </p>
    </div>
  );
}
