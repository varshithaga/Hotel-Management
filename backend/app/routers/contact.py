from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import schemas
from ..crud import contact as contact_crud
from ..database import get_db

contact_router = APIRouter(prefix="/contacts", tags=["Contact Forms"])
feedback_router = APIRouter(prefix="/feedbacks", tags=["Feedbacks"])


# --- ContactForm ---

@contact_router.get("/", response_model=list[schemas.ContactFormOut])
def list_contacts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return contact_crud.get_contacts(db, skip=skip, limit=limit)


@contact_router.get("/{contact_id}", response_model=schemas.ContactFormOut)
def get_contact(contact_id: int, db: Session = Depends(get_db)):
    db_obj = contact_crud.get_contact(db, contact_id)
    if not db_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contact form not found")
    return db_obj


@contact_router.post("/", response_model=schemas.ContactFormOut, status_code=status.HTTP_201_CREATED)
def create_contact(contact_in: schemas.ContactFormCreate, db: Session = Depends(get_db)):
    return contact_crud.create_contact(db, contact_in)


@contact_router.put("/{contact_id}", response_model=schemas.ContactFormOut)
def update_contact(contact_id: int, contact_in: schemas.ContactFormUpdate, db: Session = Depends(get_db)):
    db_obj = contact_crud.update_contact(db, contact_id, contact_in)
    if not db_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contact form not found")
    return db_obj


@contact_router.delete("/{contact_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_contact(contact_id: int, db: Session = Depends(get_db)):
    db_obj = contact_crud.delete_contact(db, contact_id)
    if not db_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contact form not found")


# --- Feedback ---

@feedback_router.get("/", response_model=list[schemas.FeedbackOut])
def list_feedbacks(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return contact_crud.get_feedbacks(db, skip=skip, limit=limit)


@feedback_router.get("/{feedback_id}", response_model=schemas.FeedbackOut)
def get_feedback(feedback_id: int, db: Session = Depends(get_db)):
    db_obj = contact_crud.get_feedback(db, feedback_id)
    if not db_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Feedback not found")
    return db_obj


@feedback_router.post("/", response_model=schemas.FeedbackOut, status_code=status.HTTP_201_CREATED)
def create_feedback(feedback_in: schemas.FeedbackCreate, db: Session = Depends(get_db)):
    return contact_crud.create_feedback(db, feedback_in)


@feedback_router.put("/{feedback_id}", response_model=schemas.FeedbackOut)
def update_feedback(feedback_id: int, feedback_in: schemas.FeedbackUpdate, db: Session = Depends(get_db)):
    db_obj = contact_crud.update_feedback(db, feedback_id, feedback_in)
    if not db_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Feedback not found")
    return db_obj


@feedback_router.delete("/{feedback_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_feedback(feedback_id: int, db: Session = Depends(get_db)):
    db_obj = contact_crud.delete_feedback(db, feedback_id)
    if not db_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Feedback not found")
