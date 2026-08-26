# Pydantic schemas for: ContactForm, Feedback
import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class ContactFormBase(BaseModel):
    name: str
    email: str
    subject: str
    message: str
    call_status: str = "not_called"
    answer_status: str = "not_answered"


class ContactFormCreate(BaseModel):
    name: str
    email: str
    subject: str
    message: str


class ContactFormUpdate(BaseModel):
    call_status: Optional[str] = None
    answer_status: Optional[str] = None


class ContactFormOut(ContactFormBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime.datetime


class FeedbackBase(BaseModel):
    name: str
    email: str
    subject: str
    message: str


class FeedbackCreate(FeedbackBase):
    pass


class FeedbackUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    subject: Optional[str] = None
    message: Optional[str] = None


class FeedbackOut(FeedbackBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime.datetime
