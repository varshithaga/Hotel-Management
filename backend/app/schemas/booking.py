# Pydantic schemas for: AllBooking, Payment, Review
import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class AllBookingBase(BaseModel):
    user_name: str
    user_email: str
    user_phone: str
    user_photo: Optional[str] = None
    room_id: int
    check_in_date: datetime.datetime
    check_out_date: datetime.datetime
    no_of_days: int
    price: float
    extra_charges: Optional[float] = None
    discount: Optional[float] = None
    total_price: float
    any_extra_info: Optional[str] = None
    was_it_reserved: bool = True


class AllBookingCreate(AllBookingBase):
    pass


class AllBookingUpdate(BaseModel):
    user_name: Optional[str] = None
    user_email: Optional[str] = None
    user_phone: Optional[str] = None
    user_photo: Optional[str] = None
    room_id: Optional[int] = None
    check_in_date: Optional[datetime.datetime] = None
    check_out_date: Optional[datetime.datetime] = None
    no_of_days: Optional[int] = None
    price: Optional[float] = None
    extra_charges: Optional[float] = None
    discount: Optional[float] = None
    total_price: Optional[float] = None
    any_extra_info: Optional[str] = None
    was_it_reserved: Optional[bool] = None


class AllBookingOut(AllBookingBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime.datetime


class PaymentBase(BaseModel):
    booking_id: int
    amount: float
    method: str
    status: str = "pending"
    transaction_ref: Optional[str] = None
    paid_at: Optional[datetime.datetime] = None


class PaymentCreate(PaymentBase):
    pass


class PaymentUpdate(BaseModel):
    amount: Optional[float] = None
    method: Optional[str] = None
    status: Optional[str] = None
    transaction_ref: Optional[str] = None
    paid_at: Optional[datetime.datetime] = None


class PaymentOut(PaymentBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime.datetime


class ReviewBase(BaseModel):
    booking_id: int
    rating: int
    comment: Optional[str] = None


class ReviewCreate(ReviewBase):
    pass


class ReviewUpdate(BaseModel):
    rating: Optional[int] = None
    comment: Optional[str] = None


class ReviewOut(ReviewBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime.datetime
