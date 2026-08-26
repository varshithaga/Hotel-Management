# Pydantic schemas for: User
from typing import Optional

from pydantic import BaseModel, ConfigDict


class UserBase(BaseModel):
    username: str
    email: str
    full_name: str
    role: str = "staff"


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    full_name: Optional[str] = None
    role: Optional[str] = None
    password: Optional[str] = None


class UserOut(UserBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
