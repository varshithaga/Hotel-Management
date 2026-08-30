from pydantic import BaseModel

from .user import UserOut


class TokenObtainRequest(BaseModel):
    username: str
    password: str


class RegisterRequest(BaseModel):
    username: str
    email: str
    full_name: str
    password: str


class TokenPair(BaseModel):
    access: str
    refresh: str
    user: UserOut


class TokenRefreshRequest(BaseModel):
    refresh: str


class TokenRefreshResponse(BaseModel):
    access: str
