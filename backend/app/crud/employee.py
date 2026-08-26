# CRUD operations for: Department, StaffRole, Employee
from sqlalchemy.orm import Session

from .. import models, schemas
from ..db_utils import safe_delete


# --- Department ---

def get_department(db: Session, department_id: int):
    return db.query(models.Department).filter(models.Department.id == department_id).first()


def query_departments(db: Session, search: str | None = None):
    query = db.query(models.Department)
    if search:
        query = query.filter(models.Department.name.ilike(f"%{search}%"))
    return query.order_by(models.Department.id.desc())


def create_department(db: Session, department_in: schemas.DepartmentCreate):
    db_obj = models.Department(**department_in.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def update_department(db: Session, department_id: int, department_in: schemas.DepartmentUpdate):
    db_obj = get_department(db, department_id)
    if not db_obj:
        return None
    for field, value in department_in.model_dump(exclude_unset=True).items():
        setattr(db_obj, field, value)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def delete_department(db: Session, department_id: int):
    db_obj = get_department(db, department_id)
    if not db_obj:
        return None
    safe_delete(db, db_obj)
    return db_obj


# --- StaffRole ---

def get_staff_role(db: Session, staff_role_id: int):
    return db.query(models.StaffRole).filter(models.StaffRole.id == staff_role_id).first()


def query_staff_roles(db: Session, search: str | None = None):
    query = db.query(models.StaffRole)
    if search:
        query = query.filter(models.StaffRole.name.ilike(f"%{search}%"))
    return query.order_by(models.StaffRole.id.desc())


def create_staff_role(db: Session, staff_role_in: schemas.StaffRoleCreate):
    db_obj = models.StaffRole(**staff_role_in.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def update_staff_role(db: Session, staff_role_id: int, staff_role_in: schemas.StaffRoleUpdate):
    db_obj = get_staff_role(db, staff_role_id)
    if not db_obj:
        return None
    for field, value in staff_role_in.model_dump(exclude_unset=True).items():
        setattr(db_obj, field, value)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def delete_staff_role(db: Session, staff_role_id: int):
    db_obj = get_staff_role(db, staff_role_id)
    if not db_obj:
        return None
    safe_delete(db, db_obj)
    return db_obj


# --- Employee ---

def get_employee(db: Session, employee_id: int):
    return db.query(models.Employee).filter(models.Employee.id == employee_id).first()


def query_employees(db: Session, search: str | None = None):
    query = db.query(models.Employee)
    if search:
        like = f"%{search}%"
        query = query.filter(
            (models.Employee.name.ilike(like))
            | (models.Employee.email.ilike(like))
            | (models.Employee.phone.ilike(like))
        )
    return query.order_by(models.Employee.id.desc())


def create_employee(db: Session, employee_in: schemas.EmployeeCreate):
    db_obj = models.Employee(**employee_in.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def update_employee(db: Session, employee_id: int, employee_in: schemas.EmployeeUpdate):
    db_obj = get_employee(db, employee_id)
    if not db_obj:
        return None
    for field, value in employee_in.model_dump(exclude_unset=True).items():
        setattr(db_obj, field, value)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def delete_employee(db: Session, employee_id: int):
    db_obj = get_employee(db, employee_id)
    if not db_obj:
        return None
    safe_delete(db, db_obj)
    return db_obj
