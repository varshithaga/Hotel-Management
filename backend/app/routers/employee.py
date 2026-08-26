from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import schemas
from ..crud import employee as employee_crud
from ..database import get_db

department_router = APIRouter(prefix="/departments", tags=["Departments"])
staff_role_router = APIRouter(prefix="/staff-roles", tags=["Staff Roles"])
employee_router = APIRouter(prefix="/employees", tags=["Employees"])


# --- Department ---

@department_router.get("/", response_model=list[schemas.DepartmentOut])
def list_departments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return employee_crud.get_departments(db, skip=skip, limit=limit)


@department_router.get("/{department_id}", response_model=schemas.DepartmentOut)
def get_department(department_id: int, db: Session = Depends(get_db)):
    db_obj = employee_crud.get_department(db, department_id)
    if not db_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Department not found")
    return db_obj


@department_router.post("/", response_model=schemas.DepartmentOut, status_code=status.HTTP_201_CREATED)
def create_department(department_in: schemas.DepartmentCreate, db: Session = Depends(get_db)):
    return employee_crud.create_department(db, department_in)


@department_router.put("/{department_id}", response_model=schemas.DepartmentOut)
def update_department(department_id: int, department_in: schemas.DepartmentUpdate, db: Session = Depends(get_db)):
    db_obj = employee_crud.update_department(db, department_id, department_in)
    if not db_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Department not found")
    return db_obj


@department_router.delete("/{department_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_department(department_id: int, db: Session = Depends(get_db)):
    db_obj = employee_crud.delete_department(db, department_id)
    if not db_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Department not found")


# --- StaffRole ---

@staff_role_router.get("/", response_model=list[schemas.StaffRoleOut])
def list_staff_roles(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return employee_crud.get_staff_roles(db, skip=skip, limit=limit)


@staff_role_router.get("/{staff_role_id}", response_model=schemas.StaffRoleOut)
def get_staff_role(staff_role_id: int, db: Session = Depends(get_db)):
    db_obj = employee_crud.get_staff_role(db, staff_role_id)
    if not db_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Staff role not found")
    return db_obj


@staff_role_router.post("/", response_model=schemas.StaffRoleOut, status_code=status.HTTP_201_CREATED)
def create_staff_role(staff_role_in: schemas.StaffRoleCreate, db: Session = Depends(get_db)):
    return employee_crud.create_staff_role(db, staff_role_in)


@staff_role_router.put("/{staff_role_id}", response_model=schemas.StaffRoleOut)
def update_staff_role(staff_role_id: int, staff_role_in: schemas.StaffRoleUpdate, db: Session = Depends(get_db)):
    db_obj = employee_crud.update_staff_role(db, staff_role_id, staff_role_in)
    if not db_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Staff role not found")
    return db_obj


@staff_role_router.delete("/{staff_role_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_staff_role(staff_role_id: int, db: Session = Depends(get_db)):
    db_obj = employee_crud.delete_staff_role(db, staff_role_id)
    if not db_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Staff role not found")


# --- Employee ---

@employee_router.get("/", response_model=list[schemas.EmployeeOut])
def list_employees(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return employee_crud.get_employees(db, skip=skip, limit=limit)


@employee_router.get("/{employee_id}", response_model=schemas.EmployeeOut)
def get_employee(employee_id: int, db: Session = Depends(get_db)):
    db_obj = employee_crud.get_employee(db, employee_id)
    if not db_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found")
    return db_obj


@employee_router.post("/", response_model=schemas.EmployeeOut, status_code=status.HTTP_201_CREATED)
def create_employee(employee_in: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    return employee_crud.create_employee(db, employee_in)


@employee_router.put("/{employee_id}", response_model=schemas.EmployeeOut)
def update_employee(employee_id: int, employee_in: schemas.EmployeeUpdate, db: Session = Depends(get_db)):
    db_obj = employee_crud.update_employee(db, employee_id, employee_in)
    if not db_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found")
    return db_obj


@employee_router.delete("/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_employee(employee_id: int, db: Session = Depends(get_db)):
    db_obj = employee_crud.delete_employee(db, employee_id)
    if not db_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found")
