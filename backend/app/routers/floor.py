from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import schemas
from ..auth import get_current_user
from ..crud import floor as floor_crud
from ..database import get_db
from ..pagination import PageParams, PaginatedResponse, paginate_query

router = APIRouter(prefix="/floors", tags=["Floors"], dependencies=[Depends(get_current_user)])


@router.get("/", response_model=PaginatedResponse[schemas.FloorOut])
def list_floors(params: PageParams = Depends(), db: Session = Depends(get_db)):
    query = floor_crud.query_floors(db, search=params.search)
    return paginate_query(query, params.page, params.limit)


@router.get("/all/", response_model=list[schemas.FloorOut])
def list_all_floors(search: str | None = None, db: Session = Depends(get_db)):
    return floor_crud.query_floors(db, search=search).all()


@router.get("/{floor_id}", response_model=schemas.FloorOut)
def get_floor(floor_id: int, db: Session = Depends(get_db)):
    db_floor = floor_crud.get_floor(db, floor_id)
    if not db_floor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Floor not found")
    return db_floor


@router.post("/", response_model=schemas.FloorOut, status_code=status.HTTP_201_CREATED)
def create_floor(floor_in: schemas.FloorCreate, db: Session = Depends(get_db)):
    return floor_crud.create_floor(db, floor_in)


@router.put("/{floor_id}", response_model=schemas.FloorOut)
def update_floor(floor_id: int, floor_in: schemas.FloorUpdate, db: Session = Depends(get_db)):
    db_floor = floor_crud.update_floor(db, floor_id, floor_in)
    if not db_floor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Floor not found")
    return db_floor


@router.delete("/{floor_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_floor(floor_id: int, db: Session = Depends(get_db)):
    db_floor = floor_crud.delete_floor(db, floor_id)
    if not db_floor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Floor not found")
