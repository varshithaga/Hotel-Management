# Pydantic schemas for: RoomType, Room, RoomImage, Amenity, RoomAmenity
import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class RoomTypeBase(BaseModel):
    name: str
    description: Optional[str] = None


class RoomTypeCreate(RoomTypeBase):
    pass


class RoomTypeUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class RoomTypeOut(RoomTypeBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


class AmenityBase(BaseModel):
    name: str
    icon: Optional[str] = None


class AmenityCreate(AmenityBase):
    pass


class AmenityUpdate(BaseModel):
    name: Optional[str] = None
    icon: Optional[str] = None


class AmenityOut(AmenityBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


class RoomImageBase(BaseModel):
    room_id: int
    image_url: str


class RoomImageCreate(RoomImageBase):
    pass


class RoomImageUpdate(BaseModel):
    image_url: Optional[str] = None


class RoomImageOut(RoomImageBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


class RoomBase(BaseModel):
    floor_id: int
    room_type_id: int
    name: str
    price_per_night: float
    capacity: Optional[int] = None
    no_of_beds: Optional[int] = None
    description: Optional[str] = None
    is_active: bool = True
    is_it_reserved: bool = False


class RoomCreate(RoomBase):
    pass


class RoomUpdate(BaseModel):
    floor_id: Optional[int] = None
    room_type_id: Optional[int] = None
    name: Optional[str] = None
    price_per_night: Optional[float] = None
    capacity: Optional[int] = None
    no_of_beds: Optional[int] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None
    is_it_reserved: Optional[bool] = None


class RoomOut(RoomBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    images: list[RoomImageOut] = []
    amenities: list[AmenityOut] = []


# --- Public (guest-facing, no auth) ---

class PublicRoomOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    price_per_night: float
    capacity: Optional[int] = None
    no_of_beds: Optional[int] = None
    description: Optional[str] = None
    is_active: bool = True
    is_it_reserved: bool = False
    floor_id: int
    room_type_id: int
    room_type_name: Optional[str] = None
    floor_name: Optional[str] = None
    images: list[RoomImageOut] = []
    amenities: list[AmenityOut] = []


class AvailabilityOut(BaseModel):
    check_in: datetime.date
    check_out: datetime.date
    nights: int
    guests: Optional[int] = None
    count: int
    available_rooms: list[PublicRoomOut] = []
