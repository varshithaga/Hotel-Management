from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import models
from .config import DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD, DEFAULT_ADMIN_USERNAME
from .database import Base, SessionLocal, engine
from .security import hash_password
from .routers import (
    auth,
    booking,
    contact,
    employee,
    floor,
    reservation,
    room,
    user,
    work_assignment,
)

app = FastAPI(title="Hotel Management API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(models.User).count() == 0:
            db.add(
                models.User(
                    username=DEFAULT_ADMIN_USERNAME,
                    email=DEFAULT_ADMIN_EMAIL,
                    full_name="Administrator",
                    role="admin",
                    hashed_password=hash_password(DEFAULT_ADMIN_PASSWORD),
                )
            )
            db.commit()
    finally:
        db.close()


@app.get("/")
def read_root():
    return {"message": "Hotel booking API is alive"}


app.include_router(auth.router, prefix="/api")
app.include_router(auth.me_router, prefix="/api")
app.include_router(user.router, prefix="/api")
app.include_router(floor.router, prefix="/api")
app.include_router(room.room_type_router, prefix="/api")
app.include_router(room.amenity_router, prefix="/api")
app.include_router(room.room_image_router, prefix="/api")
app.include_router(room.room_router, prefix="/api")
app.include_router(reservation.router, prefix="/api")
app.include_router(booking.booking_router, prefix="/api")
app.include_router(booking.payment_router, prefix="/api")
app.include_router(booking.review_router, prefix="/api")
app.include_router(contact.contact_router, prefix="/api")
app.include_router(contact.feedback_router, prefix="/api")
app.include_router(employee.department_router, prefix="/api")
app.include_router(employee.staff_role_router, prefix="/api")
app.include_router(employee.employee_router, prefix="/api")
app.include_router(work_assignment.work_type_router, prefix="/api")
app.include_router(work_assignment.work_assignment_router, prefix="/api")
app.include_router(work_assignment.work_assignment_log_router, prefix="/api")
