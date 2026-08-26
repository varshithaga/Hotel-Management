# Pydantic schemas for: Floor
from typing import Optional

from pydantic import BaseModel, ConfigDict


class FloorBase(BaseModel):
    name: str
    description: Optional[str] = None


class FloorCreate(FloorBase):
    pass


class FloorUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class FloorOut(FloorBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
