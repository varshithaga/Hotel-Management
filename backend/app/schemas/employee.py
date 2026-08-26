# Pydantic schemas for: Department, StaffRole, Employee
from typing import Optional

from pydantic import BaseModel, ConfigDict


class DepartmentBase(BaseModel):
    name: str
    description: Optional[str] = None


class DepartmentCreate(DepartmentBase):
    pass


class DepartmentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class DepartmentOut(DepartmentBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


class StaffRoleBase(BaseModel):
    name: str
    description: Optional[str] = None


class StaffRoleCreate(StaffRoleBase):
    pass


class StaffRoleUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class StaffRoleOut(StaffRoleBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


class EmployeeBase(BaseModel):
    name: str
    email: str
    phone: str
    photo: Optional[str] = None
    department_id: int
    role_id: int


class EmployeeCreate(EmployeeBase):
    pass


class EmployeeUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    photo: Optional[str] = None
    department_id: Optional[int] = None
    role_id: Optional[int] = None


class EmployeeOut(EmployeeBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
