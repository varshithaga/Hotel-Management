# Pydantic schemas for: WorkType, WorkAssignment, AssignmentEmployee, AssignmentRoom, WorkAssignmentLog
import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class WorkTypeBase(BaseModel):
    name: str
    description: Optional[str] = None
    is_active: bool = True


class WorkTypeCreate(WorkTypeBase):
    pass


class WorkTypeUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None


class WorkTypeOut(WorkTypeBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


class WorkAssignmentBase(BaseModel):
    work_type_id: int
    start_date: datetime.datetime
    end_date: Optional[datetime.datetime] = None
    status: str = "not_started"


class WorkAssignmentCreate(WorkAssignmentBase):
    employee_ids: list[int] = []
    room_ids: list[int] = []


class WorkAssignmentUpdate(BaseModel):
    work_type_id: Optional[int] = None
    start_date: Optional[datetime.datetime] = None
    end_date: Optional[datetime.datetime] = None
    status: Optional[str] = None
    employee_ids: Optional[list[int]] = None
    room_ids: Optional[list[int]] = None


class WorkAssignmentOut(WorkAssignmentBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


class WorkAssignmentLogBase(BaseModel):
    assignment_id: int
    action: str
    entity_type: Optional[str] = None
    entity_id: Optional[int] = None
    old_start_date: Optional[datetime.datetime] = None
    new_start_date: Optional[datetime.datetime] = None
    old_end_date: Optional[datetime.datetime] = None
    new_end_date: Optional[datetime.datetime] = None
    old_status: Optional[str] = None
    new_status: Optional[str] = None
    changed_by: Optional[int] = None


class WorkAssignmentLogCreate(WorkAssignmentLogBase):
    pass


class WorkAssignmentLogUpdate(BaseModel):
    action: Optional[str] = None
    old_status: Optional[str] = None
    new_status: Optional[str] = None


class WorkAssignmentLogOut(WorkAssignmentLogBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    changed_at: datetime.datetime
