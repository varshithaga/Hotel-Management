# CRUD operations for: ContactForm, Feedback
import datetime

from sqlalchemy.orm import Session

from .. import models, schemas


# --- ContactForm ---

def get_contact(db: Session, contact_id: int):
    return db.query(models.ContactForm).filter(models.ContactForm.id == contact_id).first()


def get_contacts(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.ContactForm).offset(skip).limit(limit).all()


def create_contact(db: Session, contact_in: schemas.ContactFormCreate):
    db_obj = models.ContactForm(**contact_in.model_dump(), created_at=datetime.datetime.utcnow())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def update_contact(db: Session, contact_id: int, contact_in: schemas.ContactFormUpdate):
    db_obj = get_contact(db, contact_id)
    if not db_obj:
        return None
    for field, value in contact_in.model_dump(exclude_unset=True).items():
        setattr(db_obj, field, value)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def delete_contact(db: Session, contact_id: int):
    db_obj = get_contact(db, contact_id)
    if not db_obj:
        return None
    db.delete(db_obj)
    db.commit()
    return db_obj


# --- Feedback ---

def get_feedback(db: Session, feedback_id: int):
    return db.query(models.Feedback).filter(models.Feedback.id == feedback_id).first()


def get_feedbacks(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Feedback).offset(skip).limit(limit).all()


def create_feedback(db: Session, feedback_in: schemas.FeedbackCreate):
    db_obj = models.Feedback(**feedback_in.model_dump(), created_at=datetime.datetime.utcnow())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def update_feedback(db: Session, feedback_id: int, feedback_in: schemas.FeedbackUpdate):
    db_obj = get_feedback(db, feedback_id)
    if not db_obj:
        return None
    for field, value in feedback_in.model_dump(exclude_unset=True).items():
        setattr(db_obj, field, value)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def delete_feedback(db: Session, feedback_id: int):
    db_obj = get_feedback(db, feedback_id)
    if not db_obj:
        return None
    db.delete(db_obj)
    db.commit()
    return db_obj
