# Pydantic schemas for: Reservation, ReservationRoom
import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class ReservationBase(BaseModel):
    user_name: str
    user_email: str
    user_phone: str
    user_photo: Optional[str] = None
    user_id_proof: Optional[str] = None
    reserved_check_in_date: datetime.datetime
    reserved_check_out_date: datetime.datetime
    total_price: float
    is_it_canceled: bool = False
    canceled_reason: Optional[str] = None
    canceled_at: Optional[datetime.datetime] = None


class ReservationCreate(ReservationBase):
    room_ids: list[int] = []


class ReservationUpdate(BaseModel):
    user_name: Optional[str] = None
    user_email: Optional[str] = None
    user_phone: Optional[str] = None
    user_photo: Optional[str] = None
    user_id_proof: Optional[str] = None
    reserved_check_in_date: Optional[datetime.datetime] = None
    reserved_check_out_date: Optional[datetime.datetime] = None
    total_price: Optional[float] = None
    is_it_canceled: Optional[bool] = None
    canceled_reason: Optional[str] = None
    canceled_at: Optional[datetime.datetime] = None
    room_ids: Optional[list[int]] = None


class ReservationOut(ReservationBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime.datetime
