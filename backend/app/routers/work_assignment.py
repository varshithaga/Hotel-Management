from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import schemas
from ..crud import work_assignment as work_assignment_crud
from ..database import get_db

work_type_router = APIRouter(prefix="/work-types", tags=["Work Types"])
work_assignment_router = APIRouter(prefix="/work-assignments", tags=["Work Assignments"])
work_assignment_log_router = APIRouter(prefix="/work-assignment-logs", tags=["Work Assignment Logs"])


# --- WorkType ---

@work_type_router.get("/", response_model=list[schemas.WorkTypeOut])
def list_work_types(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return work_assignment_crud.get_work_types(db, skip=skip, limit=limit)


@work_type_router.get("/{work_type_id}", response_model=schemas.WorkTypeOut)
def get_work_type(work_type_id: int, db: Session = Depends(get_db)):
    db_obj = work_assignment_crud.get_work_type(db, work_type_id)
    if not db_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Work type not found")
    return db_obj


@work_type_router.post("/", response_model=schemas.WorkTypeOut, status_code=status.HTTP_201_CREATED)
def create_work_type(work_type_in: schemas.WorkTypeCreate, db: Session = Depends(get_db)):
    return work_assignment_crud.create_work_type(db, work_type_in)


@work_type_router.put("/{work_type_id}", response_model=schemas.WorkTypeOut)
def update_work_type(work_type_id: int, work_type_in: schemas.WorkTypeUpdate, db: Session = Depends(get_db)):
    db_obj = work_assignment_crud.update_work_type(db, work_type_id, work_type_in)
    if not db_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Work type not found")
    return db_obj


@work_type_router.delete("/{work_type_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_work_type(work_type_id: int, db: Session = Depends(get_db)):
    db_obj = work_assignment_crud.delete_work_type(db, work_type_id)
    if not db_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Work type not found")


# --- WorkAssignment ---

@work_assignment_router.get("/", response_model=list[schemas.WorkAssignmentOut])
def list_work_assignments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return work_assignment_crud.get_work_assignments(db, skip=skip, limit=limit)


@work_assignment_router.get("/{assignment_id}", response_model=schemas.WorkAssignmentOut)
def get_work_assignment(assignment_id: int, db: Session = Depends(get_db)):
    db_obj = work_assignment_crud.get_work_assignment(db, assignment_id)
    if not db_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Work assignment not found")
    return db_obj


@work_assignment_router.post("/", response_model=schemas.WorkAssignmentOut, status_code=status.HTTP_201_CREATED)
def create_work_assignment(assignment_in: schemas.WorkAssignmentCreate, db: Session = Depends(get_db)):
    return work_assignment_crud.create_work_assignment(db, assignment_in)


@work_assignment_router.put("/{assignment_id}", response_model=schemas.WorkAssignmentOut)
def update_work_assignment(assignment_id: int, assignment_in: schemas.WorkAssignmentUpdate, db: Session = Depends(get_db)):
    db_obj = work_assignment_crud.update_work_assignment(db, assignment_id, assignment_in)
    if not db_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Work assignment not found")
    return db_obj


@work_assignment_router.delete("/{assignment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_work_assignment(assignment_id: int, db: Session = Depends(get_db)):
    db_obj = work_assignment_crud.delete_work_assignment(db, assignment_id)
    if not db_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Work assignment not found")


@work_assignment_router.post("/{assignment_id}/employees/{employee_id}", response_model=schemas.WorkAssignmentOut)
def add_employee_to_assignment(assignment_id: int, employee_id: int, db: Session = Depends(get_db)):
    db_obj = work_assignment_crud.add_employee_to_assignment(db, assignment_id, employee_id)
    if not db_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assignment or employee not found")
    return db_obj


@work_assignment_router.delete("/{assignment_id}/employees/{employee_id}", response_model=schemas.WorkAssignmentOut)
def remove_employee_from_assignment(assignment_id: int, employee_id: int, db: Session = Depends(get_db)):
    db_obj = work_assignment_crud.remove_employee_from_assignment(db, assignment_id, employee_id)
    if not db_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assignment or employee not found")
    return db_obj


@work_assignment_router.post("/{assignment_id}/rooms/{room_id}", response_model=schemas.WorkAssignmentOut)
def add_room_to_assignment(assignment_id: int, room_id: int, db: Session = Depends(get_db)):
    db_obj = work_assignment_crud.add_room_to_assignment(db, assignment_id, room_id)
    if not db_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assignment or room not found")
    return db_obj


@work_assignment_router.delete("/{assignment_id}/rooms/{room_id}", response_model=schemas.WorkAssignmentOut)
def remove_room_from_assignment(assignment_id: int, room_id: int, db: Session = Depends(get_db)):
    db_obj = work_assignment_crud.remove_room_from_assignment(db, assignment_id, room_id)
    if not db_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assignment or room not found")
    return db_obj


# --- WorkAssignmentLog ---

@work_assignment_log_router.get("/", response_model=list[schemas.WorkAssignmentLogOut])
def list_work_assignment_logs(assignment_id: int | None = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return work_assignment_crud.get_work_assignment_logs(db, assignment_id=assignment_id, skip=skip, limit=limit)


@work_assignment_log_router.get("/{log_id}", response_model=schemas.WorkAssignmentLogOut)
def get_work_assignment_log(log_id: int, db: Session = Depends(get_db)):
    db_obj = work_assignment_crud.get_work_assignment_log(db, log_id)
    if not db_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Work assignment log not found")
    return db_obj


@work_assignment_log_router.post("/", response_model=schemas.WorkAssignmentLogOut, status_code=status.HTTP_201_CREATED)
def create_work_assignment_log(log_in: schemas.WorkAssignmentLogCreate, db: Session = Depends(get_db)):
    return work_assignment_crud.create_work_assignment_log(db, log_in)


@work_assignment_log_router.put("/{log_id}", response_model=schemas.WorkAssignmentLogOut)
def update_work_assignment_log(log_id: int, log_in: schemas.WorkAssignmentLogUpdate, db: Session = Depends(get_db)):
    db_obj = work_assignment_crud.update_work_assignment_log(db, log_id, log_in)
    if not db_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Work assignment log not found")
    return db_obj


@work_assignment_log_router.delete("/{log_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_work_assignment_log(log_id: int, db: Session = Depends(get_db)):
    db_obj = work_assignment_crud.delete_work_assignment_log(db, log_id)
    if not db_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Work assignment log not found")
