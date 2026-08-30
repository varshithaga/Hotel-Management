import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Booking from './pages/Booking';

import ProtectedRoute from './Allpages/ProtectedRoute';
import AdminLayout from './Allpages/AdminLayout';
import Login from './Allpages/Login';
import SignUp from './Allpages/SignUp';
import Dashboard from './Allpages/Dashboard';
import FloorsPage from './Allpages/Floors';
import RoomTypesPage from './Allpages/RoomTypes';
import AmenitiesPage from './Allpages/Amenities';
import RoomsPage from './Allpages/Rooms';
import ReservationsPage from './Allpages/Reservations';
import BookingsPage from './Allpages/Bookings';
import PaymentsPage from './Allpages/Payments';
import ReviewsPage from './Allpages/Reviews';
import ContactsPage from './Allpages/Contacts';
import FeedbacksPage from './Allpages/Feedbacks';
import DepartmentsPage from './Allpages/Departments';
import StaffRolesPage from './Allpages/StaffRoles';
import EmployeesPage from './Allpages/Employees';
import WorkTypesPage from './Allpages/WorkTypes';
import WorkAssignmentsPage from './Allpages/WorkAssignments';
import UsersPage from './Allpages/Users';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/booking" element={<Booking />} />
        </Route>

        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/signup" element={<SignUp />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="floors" element={<FloorsPage />} />
          <Route path="room-types" element={<RoomTypesPage />} />
          <Route path="amenities" element={<AmenitiesPage />} />
          <Route path="rooms" element={<RoomsPage />} />
          <Route path="reservations" element={<ReservationsPage />} />
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="contacts" element={<ContactsPage />} />
          <Route path="feedbacks" element={<FeedbacksPage />} />
          <Route path="departments" element={<DepartmentsPage />} />
          <Route path="staff-roles" element={<StaffRolesPage />} />
          <Route path="employees" element={<EmployeesPage />} />
          <Route path="work-types" element={<WorkTypesPage />} />
          <Route path="work-assignments" element={<WorkAssignmentsPage />} />
          <Route path="users" element={<UsersPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
