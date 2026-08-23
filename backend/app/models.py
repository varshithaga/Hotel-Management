
import datetime

from sqlalchemy import Column, Integer, String, Float,Boolean,Date, DateTime,ForeignKey,Enum
from database import Base
from sqlalchemy.orm import relationship




class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum("admin", "staff", name="user_role_enum"), nullable=False, default="staff")


class Floor(Base):
    __tablename__ = "floors"

    id = Column(Integer,primary_key=True,index=True)
    name=Column(String,nullable=False)
    description=Column(String)

    rooms = relationship("Room", back_populates="floor")


class RoomType(Base):
    __tablename__ = "room_types"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String)

    rooms = relationship("Room", back_populates="room_type")


class Room(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True, index=True)
    floor_id = Column(Integer, ForeignKey('floors.id'), nullable=False)
    room_type_id = Column(Integer, ForeignKey('room_types.id'), nullable=False)
    name = Column(String, nullable=False)
    price_per_night = Column(Float, nullable=False)
    capacity = Column(Integer)
    no_of_beds = Column(Integer)
    description = Column(String)
    is_active = Column(Boolean, default=True)

    is_it_reserved = Column(Boolean, default=False)

    floor = relationship("Floor", back_populates="rooms")
    room_type = relationship("RoomType", back_populates="rooms")
    images = relationship("RoomImage", back_populates="room", cascade="all, delete-orphan")
    reservations = relationship("Reservation", secondary="reservation_rooms", back_populates="rooms")
    all_bookings = relationship("AllBooking", back_populates="room")
    work_assignments = relationship("WorkAssignment", secondary="assignment_rooms", back_populates="rooms")
    amenities = relationship("Amenity", secondary="room_amenities", back_populates="rooms")

class RoomImage(Base):
    __tablename__ = "room_images"

    id = Column(Integer, primary_key=True, index=True)
    room_id = Column(Integer, ForeignKey("rooms.id"), nullable=False)
    image_url = Column(String, nullable=False)

    room = relationship("Room", back_populates="images")


class Amenity(Base):
    __tablename__ = "amenities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
    icon = Column(String, nullable=True)

    rooms = relationship("Room", secondary="room_amenities", back_populates="amenities")


class RoomAmenity(Base):
    __tablename__ = "room_amenities"

    room_id = Column(Integer, ForeignKey("rooms.id"), primary_key=True)
    amenity_id = Column(Integer, ForeignKey("amenities.id"), primary_key=True)



class Reservation(Base):
    __tablename__ = "reservations"

    id = Column(Integer, primary_key=True, index=True)

    user_name = Column(String, nullable=False)
    user_email = Column(String, nullable=False)
    user_phone = Column(String, nullable=False)
    user_photo = Column(String, nullable=True)
    user_id_proof = Column(String, nullable=True)

    reserved_check_in_date = Column(DateTime, nullable=False)
    reserved_check_out_date = Column(DateTime, nullable=False)

    total_price = Column(Float, nullable=False)

    is_it_canceled = Column(Boolean, default=False)
    canceled_reason = Column(String, nullable=True)
    canceled_at = Column(DateTime, nullable=True)

    created_at = Column(DateTime, nullable=False)

    rooms = relationship(
        "Room",
        secondary="reservation_rooms",
        back_populates="reservations"
    )


class ReservationRoom(Base):
    __tablename__ = "reservation_rooms"

    reservation_id = Column(Integer, ForeignKey("reservations.id"), primary_key=True)
    room_id = Column(Integer, ForeignKey("rooms.id"), primary_key=True)


class AllBooking(Base):
    __tablename__ = "all_bookings"

    id = Column(Integer, primary_key=True, index=True)
    user_name= Column(String, nullable=False)
    user_email= Column(String, nullable=False)
    user_phone= Column(String, nullable=False)
    user_photo= Column(String, nullable=True)
    room_id = Column(Integer, ForeignKey("rooms.id"), nullable=False)
    check_in_date = Column(DateTime, nullable=False)
    check_out_date = Column(DateTime, nullable=False)
    no_of_days = Column(Integer, nullable=False)
    created_at = Column(DateTime, nullable=False)

    price = Column(Float, nullable=False)
    extra_charges = Column(Float, nullable=True)
    discount = Column(Float, nullable=True)
    total_price = Column(Float, nullable=False)

    any_extra_info = Column(String, nullable=True)
    was_it_reserved = Column(Boolean, default=True)

    room = relationship("Room", back_populates="all_bookings")
    payments = relationship("Payment", back_populates="booking", cascade="all, delete-orphan")
    review = relationship("Review", back_populates="booking", uselist=False, cascade="all, delete-orphan")


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("all_bookings.id"), nullable=False)

    amount = Column(Float, nullable=False)
    method = Column(Enum("cash", "card", "upi", "bank_transfer", name="payment_method_enum"), nullable=False)
    status = Column(Enum("pending", "paid", "failed", "refunded", name="payment_status_enum"), nullable=False, default="pending")
    transaction_ref = Column(String, nullable=True)
    paid_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.datetime.utcnow)

    booking = relationship("AllBooking", back_populates="payments")


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("all_bookings.id"), nullable=False, unique=True)

    rating = Column(Integer, nullable=False)
    comment = Column(String, nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.datetime.utcnow)

    booking = relationship("AllBooking", back_populates="review")

# -----------------------------------------------
# -----------------------------------------------



class ContactForm(Base):
    __tablename__ = "contact_forms"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    subject = Column(String, nullable=False)
    message = Column(String, nullable=False)
    call_status = Column(
        Enum("not_called", "called", name="call_status_enum"),
        nullable=False,
        default="not_called",
    )
    answer_status = Column(
        Enum("not_answered", "answered", name="answer_status_enum"),
        nullable=False,
        default="not_answered",
    )
    created_at = Column(DateTime, nullable=False)

class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    subject = Column(String, nullable=False)
    message = Column(String, nullable=False)
    created_at = Column(DateTime, nullable=False)

# -----------------------------------------------
# -----------------------------------------------

class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)

    employees = relationship("Employee", back_populates="department")


class StaffRole(Base):
    __tablename__ = "staff_roles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)

    employees = relationship("Employee", back_populates="role")


class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    photo = Column(String, nullable=True)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=False)
    role_id = Column(Integer, ForeignKey("staff_roles.id"), nullable=False)

    department = relationship("Department", back_populates="employees")
    role = relationship("StaffRole", back_populates="employees")
    work_assignments = relationship("WorkAssignment", secondary="assignment_employees", back_populates="employees")





# -------------------------------
# -----------------------------

class WorkType(Base):
    __tablename__ = "work_types"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False, unique=True)
    description = Column(String, nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    assignments = relationship( "WorkAssignment",back_populates="work_type")
#     1 → Deep Cleaning
# 2 → AC Maintenance
# 3 → Room Inspection
# 4 → Bathroom Cleaning


class WorkAssignment(Base):
    __tablename__ = "work_assignments"

    id = Column(Integer, primary_key=True, index=True)
    work_type_id = Column(Integer, ForeignKey("work_types.id"), nullable=False)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=True)

    status = Column(Enum("not_started", "in_progress", "completed", "cancelled", name="work_status_enum"), nullable=False, default="not_started")

    work_type = relationship("WorkType", back_populates="assignments")
    employees = relationship("Employee", secondary="assignment_employees", back_populates="work_assignments")
    rooms = relationship("Room", secondary="assignment_rooms", back_populates="work_assignments")
    logs = relationship("WorkAssignmentLog", back_populates="assignment", cascade="all, delete-orphan")

class AssignmentEmployee(Base):
    __tablename__ = "assignment_employees"

    assignment_id = Column(Integer,ForeignKey("work_assignments.id"),primary_key=True)
    employee_id = Column(Integer,ForeignKey("employees.id"),primary_key=True)


class AssignmentRoom(Base):
    __tablename__ = "assignment_rooms"

    assignment_id = Column(Integer,ForeignKey("work_assignments.id"),primary_key=True)
    room_id = Column(Integer,ForeignKey("rooms.id"),primary_key=True)




class WorkAssignmentLog(Base):
    __tablename__ = "work_assignment_logs"

    id = Column(Integer, primary_key=True, index=True)
    assignment_id = Column(Integer, ForeignKey("work_assignments.id"), nullable=False)

    action = Column(String, nullable=False)

    entity_type = Column(String, nullable=True)
    entity_id = Column(Integer, nullable=True)

    old_start_date = Column(DateTime, nullable=True)
    new_start_date = Column(DateTime, nullable=True)
    old_end_date = Column(DateTime, nullable=True)
    new_end_date = Column(DateTime, nullable=True)

    old_status = Column(String, nullable=True)
    new_status = Column(String, nullable=True)

    changed_by = Column(Integer, ForeignKey("employees.id"), nullable=True)
    changed_at = Column(DateTime, nullable=False, default=datetime.datetime.utcnow)

    assignment = relationship("WorkAssignment", back_populates="logs")
    changed_by_employee = relationship("Employee", foreign_keys=[changed_by])