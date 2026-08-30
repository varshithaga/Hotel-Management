# CRUD operations for: WorkType, WorkAssignment, AssignmentEmployee, AssignmentRoom, WorkAssignmentLog
from sqlalchemy.orm import Session

from .. import models, schemas
from ..db_utils import safe_delete


# --- WorkType ---

def get_work_type(db: Session, work_type_id: int):
    return db.query(models.WorkType).filter(models.WorkType.id == work_type_id).first()


def query_work_types(db: Session, search: str | None = None):
    query = db.query(models.WorkType)
    if search:
        query = query.filter(models.WorkType.name.ilike(f"%{search}%"))
    return query.order_by(models.WorkType.id.asc())


def create_work_type(db: Session, work_type_in: schemas.WorkTypeCreate):
    db_obj = models.WorkType(**work_type_in.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def update_work_type(db: Session, work_type_id: int, work_type_in: schemas.WorkTypeUpdate):
    db_obj = get_work_type(db, work_type_id)
    if not db_obj:
        return None
    for field, value in work_type_in.model_dump(exclude_unset=True).items():
        setattr(db_obj, field, value)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def delete_work_type(db: Session, work_type_id: int):
    db_obj = get_work_type(db, work_type_id)
    if not db_obj:
        return None
    safe_delete(db, db_obj)
    return db_obj


# --- WorkAssignment ---

def get_work_assignment(db: Session, assignment_id: int):
    return db.query(models.WorkAssignment).filter(models.WorkAssignment.id == assignment_id).first()


def query_work_assignments(db: Session, search: str | None = None):
    query = db.query(models.WorkAssignment)
    if search:
        query = query.filter(models.WorkAssignment.status.ilike(f"%{search}%"))
    return query.order_by(models.WorkAssignment.id.asc())


def create_work_assignment(db: Session, assignment_in: schemas.WorkAssignmentCreate):
    data = assignment_in.model_dump(exclude={"employee_ids", "room_ids"})
    db_obj = models.WorkAssignment(**data)
    if assignment_in.employee_ids:
        db_obj.employees = db.query(models.Employee).filter(
            models.Employee.id.in_(assignment_in.employee_ids)
        ).all()
    if assignment_in.room_ids:
        db_obj.rooms = db.query(models.Room).filter(
            models.Room.id.in_(assignment_in.room_ids)
        ).all()
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def update_work_assignment(db: Session, assignment_id: int, assignment_in: schemas.WorkAssignmentUpdate):
    db_obj = get_work_assignment(db, assignment_id)
    if not db_obj:
        return None
    update_data = assignment_in.model_dump(exclude_unset=True)
    employee_ids = update_data.pop("employee_ids", None)
    room_ids = update_data.pop("room_ids", None)
    for field, value in update_data.items():
        setattr(db_obj, field, value)
    if employee_ids is not None:
        db_obj.employees = db.query(models.Employee).filter(models.Employee.id.in_(employee_ids)).all()
    if room_ids is not None:
        db_obj.rooms = db.query(models.Room).filter(models.Room.id.in_(room_ids)).all()
    db.commit()
    db.refresh(db_obj)
    return db_obj


def delete_work_assignment(db: Session, assignment_id: int):
    db_obj = get_work_assignment(db, assignment_id)
    if not db_obj:
        return None
    safe_delete(db, db_obj)
    return db_obj


def add_employee_to_assignment(db: Session, assignment_id: int, employee_id: int):
    assignment = get_work_assignment(db, assignment_id)
    employee = db.query(models.Employee).filter(models.Employee.id == employee_id).first()
    if not assignment or not employee:
        return None
    if employee not in assignment.employees:
        assignment.employees.append(employee)
        db.commit()
        db.refresh(assignment)
    return assignment


def remove_employee_from_assignment(db: Session, assignment_id: int, employee_id: int):
    assignment = get_work_assignment(db, assignment_id)
    employee = db.query(models.Employee).filter(models.Employee.id == employee_id).first()
    if not assignment or not employee:
        return None
    if employee in assignment.employees:
        assignment.employees.remove(employee)
        db.commit()
        db.refresh(assignment)
    return assignment


def add_room_to_assignment(db: Session, assignment_id: int, room_id: int):
    assignment = get_work_assignment(db, assignment_id)
    room = db.query(models.Room).filter(models.Room.id == room_id).first()
    if not assignment or not room:
        return None
    if room not in assignment.rooms:
        assignment.rooms.append(room)
        db.commit()
        db.refresh(assignment)
    return assignment


def remove_room_from_assignment(db: Session, assignment_id: int, room_id: int):
    assignment = get_work_assignment(db, assignment_id)
    room = db.query(models.Room).filter(models.Room.id == room_id).first()
    if not assignment or not room:
        return None
    if room in assignment.rooms:
        assignment.rooms.remove(room)
        db.commit()
        db.refresh(assignment)
    return assignment


# --- WorkAssignmentLog ---

def get_work_assignment_log(db: Session, log_id: int):
    return db.query(models.WorkAssignmentLog).filter(models.WorkAssignmentLog.id == log_id).first()


def query_work_assignment_logs(db: Session, assignment_id: int | None = None, search: str | None = None):
    query = db.query(models.WorkAssignmentLog)
    if assignment_id is not None:
        query = query.filter(models.WorkAssignmentLog.assignment_id == assignment_id)
    if search:
        query = query.filter(models.WorkAssignmentLog.action.ilike(f"%{search}%"))
    return query.order_by(models.WorkAssignmentLog.id.asc())


def create_work_assignment_log(db: Session, log_in: schemas.WorkAssignmentLogCreate):
    db_obj = models.WorkAssignmentLog(**log_in.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def update_work_assignment_log(db: Session, log_id: int, log_in: schemas.WorkAssignmentLogUpdate):
    db_obj = get_work_assignment_log(db, log_id)
    if not db_obj:
        return None
    for field, value in log_in.model_dump(exclude_unset=True).items():
        setattr(db_obj, field, value)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def delete_work_assignment_log(db: Session, log_id: int):
    db_obj = get_work_assignment_log(db, log_id)
    if not db_obj:
        return None
    safe_delete(db, db_obj)
    return db_obj
