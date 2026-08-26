from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import schemas
from ..auth import get_current_user
from ..crud import user as user_crud
from ..database import get_db
from ..pagination import PageParams, PaginatedResponse, paginate_query

router = APIRouter(prefix="/users", tags=["Users"], dependencies=[Depends(get_current_user)])


@router.get("/", response_model=PaginatedResponse[schemas.UserOut])
def list_users(params: PageParams = Depends(), db: Session = Depends(get_db)):
    query = user_crud.query_users(db, search=params.search)
    return paginate_query(query, params.page, params.limit)


@router.get("/all/", response_model=list[schemas.UserOut])
def list_all_users(search: str | None = None, db: Session = Depends(get_db)):
    return user_crud.query_users(db, search=search).all()


@router.get("/{user_id}", response_model=schemas.UserOut)
def get_user(user_id: int, db: Session = Depends(get_db)):
    db_user = user_crud.get_user(db, user_id)
    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return db_user


@router.post("/", response_model=schemas.UserOut, status_code=status.HTTP_201_CREATED)
def create_user(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    return user_crud.create_user(db, user_in)


@router.put("/{user_id}", response_model=schemas.UserOut)
def update_user(user_id: int, user_in: schemas.UserUpdate, db: Session = Depends(get_db)):
    db_user = user_crud.update_user(db, user_id, user_in)
    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return db_user


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    db_user = user_crud.delete_user(db, user_id)
    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
