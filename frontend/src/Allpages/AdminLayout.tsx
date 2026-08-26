import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "../access/access";
import "./admin.css";

const navGroups: { label: string; items: { to: string; label: string }[] }[] = [
  {
    label: "Property",
    items: [
      { to: "/admin/floors", label: "Floors" },
      { to: "/admin/room-types", label: "Room Types" },
      { to: "/admin/amenities", label: "Amenities" },
      { to: "/admin/rooms", label: "Rooms" },
    ],
  },
  {
    label: "Guests",
    items: [
      { to: "/admin/reservations", label: "Reservations" },
      { to: "/admin/bookings", label: "Bookings" },
      { to: "/admin/payments", label: "Payments" },
      { to: "/admin/reviews", label: "Reviews" },
    ],
  },
  {
    label: "Front Desk",
    items: [
      { to: "/admin/contacts", label: "Contact Forms" },
      { to: "/admin/feedbacks", label: "Feedbacks" },
    ],
  },
  {
    label: "Staff",
    items: [
      { to: "/admin/departments", label: "Departments" },
      { to: "/admin/staff-roles", label: "Staff Roles" },
      { to: "/admin/employees", label: "Employees" },
      { to: "/admin/work-types", label: "Work Types" },
      { to: "/admin/work-assignments", label: "Work Assignments" },
    ],
  },
  {
    label: "Access",
    items: [{ to: "/admin/users", label: "Users" }],
  },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">Grandeur Admin</div>
        <nav className="admin-nav">
          {navGroups.map((group) => (
            <div key={group.label} className="admin-nav-group">
              <div className="admin-nav-group-label">{group.label}</div>
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => "admin-nav-link" + (isActive ? " active" : "")}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar">
          <div />
          <div className="admin-topbar-user">
            <span>
              {user?.full_name} <span className="admin-role-badge">{user?.role}</span>
            </span>
            <button type="button" className="admin-btn admin-btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
