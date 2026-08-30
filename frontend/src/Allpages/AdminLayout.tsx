import { useEffect, useRef, useState } from "react";
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

function initials(name?: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "?";
}

export default function AdminLayout() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">Grandeur Admin</div>
        <nav className="admin-nav">
          <div className="admin-nav-group">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) => "admin-nav-link" + (isActive ? " active" : "")}
            >
              Dashboard
            </NavLink>
          </div>
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
          <div className="admin-profile" ref={profileRef}>
            <button
              type="button"
              className="admin-profile-trigger"
              onClick={() => setMenuOpen((o) => !o)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-label="Open profile menu"
            >
              <span className="admin-avatar">{initials(user?.full_name)}</span>
              <span className="admin-profile-name">{user?.full_name}</span>
              <i className={`fa-solid fa-chevron-down admin-profile-caret${menuOpen ? " open" : ""}`} />
            </button>

            {menuOpen && (
              <div className="admin-profile-menu" role="menu">
                <div className="admin-profile-head">
                  <span className="admin-avatar admin-avatar-lg">{initials(user?.full_name)}</span>
                  <div className="admin-profile-head-text">
                    <strong>{user?.full_name}</strong>
                    <span>{user?.email}</span>
                    <span className="admin-role-badge">{user?.role}</span>
                  </div>
                </div>
                <button type="button" className="admin-profile-signout" onClick={handleLogout} role="menuitem">
                  <i className="fa-solid fa-right-from-bracket" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </header>
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
