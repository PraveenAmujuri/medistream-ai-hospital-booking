from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str

class UserLogin(BaseModel):
    email_or_username: str
    password: str

class UserPublic(BaseModel):
    id: str
    email: EmailStr
    username: str
    role: str
    provider: str

class GoogleUser(BaseModel):
    email: EmailStr
    name: Optional[str]
    google_id: str
