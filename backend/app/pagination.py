import math
from typing import Generic, List, Optional, TypeVar

from fastapi import Query
from pydantic import BaseModel
from sqlalchemy.orm import Query as SAQuery

T = TypeVar("T")


class PaginatedResponse(BaseModel, Generic[T]):
    count: int
    next: Optional[int] = None
    previous: Optional[int] = None
    current_page: int
    total_pages: int
    results: List[T]


class PageParams:
    def __init__(
        self,
        page: int = Query(1, ge=1),
        limit: int = Query(10, ge=1, le=500),
        search: Optional[str] = Query(None),
    ):
        self.page = page
        self.limit = limit
        self.search = search


def paginate_query(query: SAQuery, page: int, limit: int) -> dict:
    limit = max(1, min(limit, 500))
    page = max(1, page)
    count = query.count()
    total_pages = max(1, math.ceil(count / limit)) if count else 1
    if page > total_pages:
        page = total_pages
    items = query.offset((page - 1) * limit).limit(limit).all()
    next_page = page + 1 if page < total_pages and count else None
    previous_page = page - 1 if page > 1 else None
    return {
        "count": count,
        "next": next_page,
        "previous": previous_page,
        "current_page": page,
        "total_pages": total_pages,
        "results": items,
    }
