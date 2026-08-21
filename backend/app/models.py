from sqlalchemy import Column, Integer, String, Float,Boolean,Date, DateTime,ForeignKey
from database import Base
from sqlalchemy.orm import relationship




class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)


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

    floor = relationship("Floor", back_populates="rooms")
    room_type = relationship("RoomType", back_populates="rooms")
    images = relationship("RoomImage", back_populates="room", cascade="all, delete-orphan")

class RoomImage(Base):
    __tablename__ = "room_images"

    id = Column(Integer, primary_key=True, index=True)
    room_id = Column(Integer, ForeignKey("rooms.id"), nullable=False)
    image_url = Column(String, nullable=False)

    room = relationship("Room", back_populates="images")


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    room_id = Column(Integer, ForeignKey("rooms.id"), nullable=False)
    check_in_date = Column(DateTime, nullable=False)
    check_out_date = Column(DateTime, nullable=False)
    total_price = Column(Float, nullable=False)

    user = relationship("User")
    room = relationship("Room")


class Reservation(Base):
    __tablename__ = "reservations"

    id = Column(Integer, primary_key=True, index=True)
    user_name= Column(String, nullable=False)
    user_email= Column(String, nullable=False)
    user_phone= Column(String, nullable=False)
    user_photo= Column(String, nullable=True)
    room_id = Column(Integer, ForeignKey("rooms.id"), nullable=False)
    reserved_check_in_date = Column(DateTime, nullable=False)
    reserved_check_out_date = Column(DateTime, nullable=False)
    total_price = Column(Float, nullable=False)

    room = relationship("Room")