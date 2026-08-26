from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import models
from .database import Base, engine
from .routers import (
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


@app.get("/")
def read_root():
    return {"message": "Hotel booking API is alive"}


app.include_router(user.router)
app.include_router(floor.router)
app.include_router(room.room_type_router)
app.include_router(room.amenity_router)
app.include_router(room.room_image_router)
app.include_router(room.room_router)
app.include_router(reservation.router)
app.include_router(booking.booking_router)
app.include_router(booking.payment_router)
app.include_router(booking.review_router)
app.include_router(contact.contact_router)
app.include_router(contact.feedback_router)
app.include_router(employee.department_router)
app.include_router(employee.staff_role_router)
app.include_router(employee.employee_router)
app.include_router(work_assignment.work_type_router)
app.include_router(work_assignment.work_assignment_router)
app.include_router(work_assignment.work_assignment_log_router)
