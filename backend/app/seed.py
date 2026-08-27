"""Populate the database with realistic dummy data.

Usage (from the ``backend`` folder, with the virtualenv active)::

    python -m app.seed            # insert sample data; refuses if rooms already exist
    python -m app.seed --reset    # DROP every table, recreate, then insert

The data covers every model so both the guest website (rooms / availability)
and every admin table have something to show.
"""

import argparse
import datetime

from . import models
from .config import DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD, DEFAULT_ADMIN_USERNAME
from .database import Base, SessionLocal, engine
from .security import hash_password

TODAY = datetime.date.today()
NOW = datetime.datetime.utcnow()


def _dt(day_offset: int, hour: int = 14) -> datetime.datetime:
    """A datetime `day_offset` days from today at `hour`:00."""
    return datetime.datetime.combine(TODAY + datetime.timedelta(days=day_offset), datetime.time(hour))


ROOM_PHOTOS = [
    "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=800&q=80",
]


def seed(db, *, reset: bool) -> None:
    if reset:
        print("Dropping and recreating all tables...")
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)
    else:
        Base.metadata.create_all(bind=engine)
        if db.query(models.Room).count() > 0:
            print("Rooms already exist - nothing to do. Use --reset to wipe and reseed.")
            return

    # ------------------------------------------------------------------ Users
    admin = models.User(
        username=DEFAULT_ADMIN_USERNAME,
        email=DEFAULT_ADMIN_EMAIL,
        full_name="Administrator",
        role="admin",
        hashed_password=hash_password(DEFAULT_ADMIN_PASSWORD),
    )
    staff_users = [
        models.User(username="fdesk", email="frontdesk@grandeurhotel.com",
                    full_name="Nadia Okoro", role="staff", hashed_password=hash_password("staff123")),
        models.User(username="hkeeping", email="housekeeping@grandeurhotel.com",
                    full_name="Diego Alvarez", role="staff", hashed_password=hash_password("staff123")),
        models.User(username="manager", email="manager@grandeurhotel.com",
                    full_name="Helena Brandt", role="admin", hashed_password=hash_password("manager123")),
    ]
    db.add_all([admin, *staff_users])
    db.commit()

    # ----------------------------------------------------------------- Floors
    floors = [
        models.Floor(name="Ground Floor", description="Lobby, reception and accessible rooms"),
        models.Floor(name="First Floor", description="Standard rooms wing"),
        models.Floor(name="Second Floor", description="Suites and family rooms"),
        models.Floor(name="Third Floor", description="Premium suites with city views"),
        models.Floor(name="Penthouse Level", description="Exclusive top-floor residences"),
    ]
    db.add_all(floors)
    db.commit()
    f_ground, f_first, f_second, f_third, f_pent = floors

    # ------------------------------------------------------------- Room types
    room_types = [
        models.RoomType(name="Deluxe Room", description="King bed, city view, 38 m2"),
        models.RoomType(name="Executive Suite", description="Separate living area and skyline views, 55 m2"),
        models.RoomType(name="Presidential Suite", description="Private terrace, jacuzzi and butler service, 90 m2"),
        models.RoomType(name="Garden Villa", description="Private villa with direct pool-deck access, 75 m2"),
        models.RoomType(name="Family Room", description="Extra space and amenities for families, 60 m2"),
        models.RoomType(name="Honeymoon Suite", description="Private balcony and champagne service, 65 m2"),
    ]
    db.add_all(room_types)
    db.commit()
    t_deluxe, t_exec, t_pres, t_villa, t_family, t_honey = room_types

    # -------------------------------------------------------------- Amenities
    amenities = [
        models.Amenity(name="Free Wi-Fi", icon="fa-solid fa-wifi"),
        models.Amenity(name="Air Conditioning", icon="fa-solid fa-snowflake"),
        models.Amenity(name="Flat-screen TV", icon="fa-solid fa-tv"),
        models.Amenity(name="Minibar", icon="fa-solid fa-wine-glass"),
        models.Amenity(name="Room Service", icon="fa-solid fa-bell-concierge"),
        models.Amenity(name="In-room Safe", icon="fa-solid fa-lock"),
        models.Amenity(name="Coffee Maker", icon="fa-solid fa-mug-hot"),
        models.Amenity(name="Private Balcony", icon="fa-solid fa-door-open"),
        models.Amenity(name="Bathtub", icon="fa-solid fa-bath"),
        models.Amenity(name="City View", icon="fa-solid fa-city"),
    ]
    db.add_all(amenities)
    db.commit()
    (a_wifi, a_ac, a_tv, a_minibar, a_service, a_safe,
     a_coffee, a_balcony, a_tub, a_view) = amenities
    base_amen = [a_wifi, a_ac, a_tv, a_safe]

    # ------------------------------------------------------------------ Rooms
    # (number, floor, type, price, capacity, beds, description, active, reserved_flag, extra amenities)
    room_specs = [
        ("101", f_ground, t_deluxe, 180, 2, 1, "Accessible deluxe room near the lobby.", True, False, [a_coffee, a_view]),
        ("102", f_ground, t_deluxe, 185, 2, 1, "Deluxe room with a quiet courtyard outlook.", True, False, [a_coffee]),
        ("103", f_ground, t_family, 260, 5, 2, "Ground-floor family room with two double beds.", True, False, [a_coffee, a_minibar]),
        ("201", f_first, t_deluxe, 190, 2, 1, "Deluxe room with a king bed and city view.", True, True, [a_view, a_minibar]),
        ("202", f_first, t_deluxe, 190, 2, 1, "Deluxe room with a walk-in shower.", True, False, [a_view]),
        ("203", f_first, t_exec, 320, 3, 1, "Executive suite with a separate lounge.", True, False, [a_view, a_minibar, a_service, a_balcony]),
        ("301", f_second, t_villa, 410, 4, 2, "Garden villa opening onto the pool deck.", True, True, [a_balcony, a_minibar, a_service, a_tub]),
        ("302", f_second, t_family, 275, 5, 2, "Spacious family room with bunk nook.", True, True, [a_coffee, a_minibar, a_balcony]),
        ("303", f_second, t_honey, 480, 2, 1, "Honeymoon suite with private balcony.", True, False, [a_balcony, a_tub, a_service, a_minibar]),
        ("401", f_third, t_pres, 560, 4, 2, "Presidential suite with panoramic city views.", True, True, [a_view, a_balcony, a_tub, a_service, a_minibar]),
        ("402", f_third, t_honey, 495, 2, 1, "Corner honeymoon suite with sunset views.", True, False, [a_balcony, a_tub, a_view]),
        ("PH1", f_pent, t_pres, 750, 6, 3, "Penthouse residence with wraparound terrace and butler.", True, False, [a_view, a_balcony, a_tub, a_service, a_minibar, a_coffee]),
        ("404", f_third, t_deluxe, 200, 2, 1, "Deluxe room currently closed for refurbishment.", False, False, [a_view]),
    ]
    rooms_by_number = {}
    for i, (num, floor, rtype, price, cap, beds, desc, active, reserved, extra) in enumerate(room_specs):
        room = models.Room(
            floor_id=floor.id,
            room_type_id=rtype.id,
            name=f"Room {num}",
            price_per_night=float(price),
            capacity=cap,
            no_of_beds=beds,
            description=desc,
            is_active=active,
            is_it_reserved=reserved,
            amenities=list(dict.fromkeys(base_amen + extra)),
        )
        room.images = [
            models.RoomImage(image_url=ROOM_PHOTOS[i % len(ROOM_PHOTOS)]),
            models.RoomImage(image_url=ROOM_PHOTOS[(i + 3) % len(ROOM_PHOTOS)]),
        ]
        db.add(room)
        rooms_by_number[num] = room
    db.commit()
    R = rooms_by_number

    # ----------------------------------------------------------- Reservations
    reservation_specs = [
        ("Aarav Sharma", "aarav.sharma@example.com", "+1 555 0101", ["201"], 5, 8, False, None),
        ("Priya Nair", "priya.nair@example.com", "+1 555 0102", ["301", "302"], 10, 14, False, None),
        ("John Carter", "john.carter@example.com", "+1 555 0103", ["401"], 2, 4, False, None),
        ("Mei Lin", "mei.lin@example.com", "+1 555 0104", ["101"], -10, -7, False, None),
        ("Rohit Verma", "rohit.verma@example.com", "+1 555 0105", ["PH1"], 6, 9, True, "Guest cancelled - flight change"),
    ]
    for name, email, phone, room_nums, ci, co, canceled, reason in reservation_specs:
        booked_rooms = [R[n] for n in room_nums]
        nights = co - ci
        total = sum(r.price_per_night for r in booked_rooms) * nights
        db.add(models.Reservation(
            user_name=name,
            user_email=email,
            user_phone=phone,
            reserved_check_in_date=_dt(ci),
            reserved_check_out_date=_dt(co),
            total_price=float(total),
            is_it_canceled=canceled,
            canceled_reason=reason,
            canceled_at=NOW if canceled else None,
            created_at=NOW,
            rooms=booked_rooms,
        ))
    db.commit()

    # --------------------------------------------------------------- Bookings
    booking_specs = [
        ("Emily Stone", "emily.stone@example.com", "+1 555 0201", "102", -3, -1, 0, 40),
        ("Carlos Mendez", "carlos.mendez@example.com", "+1 555 0202", "203", -20, -18, 25, 0),
        ("Fatima Ali", "fatima.ali@example.com", "+1 555 0203", "103", 1, 4, 0, 30),
        ("Liam O'Brien", "liam.obrien@example.com", "+1 555 0204", "202", -1, 2, 0, 0),
        ("Sofia Rossi", "sofia.rossi@example.com", "+1 555 0205", "402", 12, 15, 60, 50),
        ("Kenji Tanaka", "kenji.tanaka@example.com", "+1 555 0206", "303", -30, -25, 0, 100),
    ]
    bookings = []
    for name, email, phone, room_num, ci, co, extra, discount in booking_specs:
        room = R[room_num]
        days = co - ci
        price = room.price_per_night * days
        total = price + extra - discount
        booking = models.AllBooking(
            user_name=name,
            user_email=email,
            user_phone=phone,
            room_id=room.id,
            check_in_date=_dt(ci),
            check_out_date=_dt(co),
            no_of_days=days,
            price=float(price),
            extra_charges=float(extra) or None,
            discount=float(discount) or None,
            total_price=float(total),
            any_extra_info="Late checkout requested" if extra else None,
            was_it_reserved=ci >= 0,
            created_at=NOW,
        )
        db.add(booking)
        bookings.append(booking)
    db.commit()

    # --------------------------------------------------------------- Payments
    pay_specs = [
        (0, "card", "paid"),
        (1, "cash", "paid"),
        (2, "upi", "pending"),
        (3, "card", "failed"),
        (4, "bank_transfer", "paid"),
        (5, "card", "refunded"),
    ]
    for idx, method, pstatus in pay_specs:
        b = bookings[idx]
        db.add(models.Payment(
            booking_id=b.id,
            amount=b.total_price,
            method=method,
            status=pstatus,
            transaction_ref=f"TXN-{1000 + b.id}",
            paid_at=NOW if pstatus in ("paid", "refunded") else None,
        ))
    db.commit()

    # ---------------------------------------------------------------- Reviews
    review_specs = [
        (0, 5, "Spotless room and wonderful staff. Will be back!"),
        (1, 4, "Great value, though the lift was slow at peak times."),
        (5, 5, "The honeymoon suite balcony made our trip unforgettable."),
        (3, 3, "Comfortable bed but the room faced a noisy street."),
    ]
    for idx, rating, comment in review_specs:
        db.add(models.Review(booking_id=bookings[idx].id, rating=rating, comment=comment))
    db.commit()

    # ---------------------------------------------------------- Contact forms
    contact_specs = [
        ("Grace Miller", "grace.miller@example.com", "Group booking enquiry",
         "Do you offer rates for a 15-room corporate block in October?", "called", "answered"),
        ("Tom Becker", "tom.becker@example.com", "Airport transfer",
         "Is a shuttle available for a 6am arrival?", "not_called", "not_answered"),
        ("Yuki Sato", "yuki.sato@example.com", "Lost property",
         "I think I left a charger in Room 202 last weekend.", "called", "not_answered"),
        ("Amara Nwosu", "amara.nwosu@example.com", "Wedding venue",
         "Can the garden terrace host a 60-person ceremony?", "not_called", "not_answered"),
        ("Peter Novak", "peter.novak@example.com", "Accessibility",
         "Does Room 101 have a roll-in shower?", "called", "answered"),
    ]
    for name, email, subject, message, call_status, answer_status in contact_specs:
        db.add(models.ContactForm(
            name=name, email=email, subject=subject, message=message,
            call_status=call_status, answer_status=answer_status, created_at=NOW,
        ))
    db.commit()

    # -------------------------------------------------------------- Feedbacks
    feedback_specs = [
        ("Emily Stone", "emily.stone@example.com", "Housekeeping", "Turndown service was a lovely touch."),
        ("Carlos Mendez", "carlos.mendez@example.com", "Breakfast", "More vegetarian options would be great."),
        ("Fatima Ali", "fatima.ali@example.com", "Check-in", "Check-in took 20 minutes - please add a desk."),
        ("Sofia Rossi", "sofia.rossi@example.com", "Spa", "The spa was the highlight of our stay."),
    ]
    for name, email, subject, message in feedback_specs:
        db.add(models.Feedback(name=name, email=email, subject=subject, message=message, created_at=NOW))
    db.commit()

    # ------------------------------------------------------------ Departments
    departments = [
        models.Department(name="Front Office", description="Reception, concierge and guest relations"),
        models.Department(name="Housekeeping", description="Room and public-area cleaning"),
        models.Department(name="Food & Beverage", description="Restaurant, bar and room service"),
        models.Department(name="Maintenance", description="Engineering and repairs"),
        models.Department(name="Security", description="Premises safety and surveillance"),
    ]
    db.add_all(departments)
    db.commit()
    d_front, d_house, d_fb, d_maint, d_sec = departments

    # ------------------------------------------------------------ Staff roles
    staff_roles = [
        models.StaffRole(name="Duty Manager", description="Shift lead across departments"),
        models.StaffRole(name="Receptionist", description="Front-desk check-in and check-out"),
        models.StaffRole(name="Housekeeper", description="Guest-room cleaning"),
        models.StaffRole(name="Chef", description="Kitchen production"),
        models.StaffRole(name="Waiter", description="Restaurant and room service"),
        models.StaffRole(name="Technician", description="Building maintenance and repairs"),
    ]
    db.add_all(staff_roles)
    db.commit()
    r_mgr, r_recep, r_house, r_chef, r_waiter, r_tech = staff_roles

    # -------------------------------------------------------------- Employees
    employee_specs = [
        ("Nadia Okoro", "nadia.okoro@grandeurhotel.com", "+1 555 0301", d_front, r_mgr),
        ("Sam Whitfield", "sam.whitfield@grandeurhotel.com", "+1 555 0302", d_front, r_recep),
        ("Ivy Chen", "ivy.chen@grandeurhotel.com", "+1 555 0303", d_front, r_recep),
        ("Diego Alvarez", "diego.alvarez@grandeurhotel.com", "+1 555 0304", d_house, r_house),
        ("Marta Kowalski", "marta.kowalski@grandeurhotel.com", "+1 555 0305", d_house, r_house),
        ("Ben Carter", "ben.carter@grandeurhotel.com", "+1 555 0306", d_house, r_house),
        ("Pierre Dubois", "pierre.dubois@grandeurhotel.com", "+1 555 0307", d_fb, r_chef),
        ("Lucia Romano", "lucia.romano@grandeurhotel.com", "+1 555 0308", d_fb, r_waiter),
        ("Omar Haddad", "omar.haddad@grandeurhotel.com", "+1 555 0309", d_maint, r_tech),
        ("Grace Park", "grace.park@grandeurhotel.com", "+1 555 0310", d_sec, r_mgr),
    ]
    employees = []
    for name, email, phone, dept, role in employee_specs:
        emp = models.Employee(name=name, email=email, phone=phone,
                              department_id=dept.id, role_id=role.id)
        db.add(emp)
        employees.append(emp)
    db.commit()

    # ------------------------------------------------------------ Work types
    work_types = [
        models.WorkType(name="Deep Cleaning", description="Full room deep clean between long stays"),
        models.WorkType(name="AC Maintenance", description="Filter and coil servicing"),
        models.WorkType(name="Room Inspection", description="Quality check before guest arrival"),
        models.WorkType(name="Bathroom Repair", description="Plumbing and fixture repairs"),
        models.WorkType(name="Laundry Service", description="Linen collection and replacement"),
    ]
    db.add_all(work_types)
    db.commit()
    w_deep, w_ac, w_inspect, w_bath, w_laundry = work_types

    # ------------------------------------------------------- Work assignments
    assignment_specs = [
        (w_deep, -1, 0, "completed", [employees[3], employees[4]], ["101", "102"]),
        (w_ac, 1, 1, "not_started", [employees[8]], ["201", "202", "203"]),
        (w_inspect, 0, 0, "in_progress", [employees[0], employees[5]], ["301", "302"]),
        (w_bath, -3, -2, "completed", [employees[8]], ["404"]),
        (w_laundry, 0, 0, "in_progress", [employees[4]], ["401", "PH1"]),
    ]
    assignments = []
    for wtype, start_off, end_off, wstatus, emps, room_nums in assignment_specs:
        wa = models.WorkAssignment(
            work_type_id=wtype.id,
            start_date=_dt(start_off, 9),
            end_date=_dt(end_off, 17),
            status=wstatus,
            employees=emps,
            rooms=[R[n] for n in room_nums],
        )
        db.add(wa)
        assignments.append(wa)
    db.commit()

    # --------------------------------------------------- Work assignment logs
    log_specs = [
        (0, "created", "not_started", "not_started"),
        (0, "status_changed", "in_progress", "completed"),
        (2, "status_changed", "not_started", "in_progress"),
    ]
    for idx, action, old_status, new_status in log_specs:
        wa = assignments[idx]
        db.add(models.WorkAssignmentLog(
            assignment_id=wa.id,
            action=action,
            entity_type="work_assignment",
            entity_id=wa.id,
            old_status=old_status,
            new_status=new_status,
            changed_by=employees[0].id,
            changed_at=NOW,
        ))
    db.commit()

    print("Seed complete:")
    for label, model in [
        ("users", models.User), ("floors", models.Floor), ("room types", models.RoomType),
        ("amenities", models.Amenity), ("rooms", models.Room), ("room images", models.RoomImage),
        ("reservations", models.Reservation), ("bookings", models.AllBooking),
        ("payments", models.Payment), ("reviews", models.Review),
        ("contact forms", models.ContactForm), ("feedbacks", models.Feedback),
        ("departments", models.Department), ("staff roles", models.StaffRole),
        ("employees", models.Employee), ("work types", models.WorkType),
        ("work assignments", models.WorkAssignment), ("work assignment logs", models.WorkAssignmentLog),
    ]:
        print(f"  {label:22} {db.query(model).count()}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Seed the hotel database with dummy data.")
    parser.add_argument("--reset", action="store_true", help="drop and recreate all tables first")
    args = parser.parse_args()

    db = SessionLocal()
    try:
        seed(db, reset=args.reset)
    finally:
        db.close()


if __name__ == "__main__":
    main()
