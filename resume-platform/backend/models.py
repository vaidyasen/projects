from typing import Optional, List
from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    id: str
    email: str
    created_at: datetime

class Token(BaseModel):
    access_token: str
    token_type: str

class Education(BaseModel):
    institution: str
    degree: str
    field_of_study: str
    start_date: str
    end_date: Optional[str] = None
    grade: Optional[str] = None

class Experience(BaseModel):
    company: str
    position: str
    start_date: str
    end_date: Optional[str] = None
    description: str
    location: Optional[str] = None

class ResumeCreate(BaseModel):
    title: str
    personal_details: dict
    education: List[Education] = []
    experience: List[Experience] = []
    skills: List[str] = []
    summary: Optional[str] = None

class ResumeUpdate(BaseModel):
    title: Optional[str] = None
    personal_details: Optional[dict] = None
    education: Optional[List[Education]] = None
    experience: Optional[List[Experience]] = None
    skills: Optional[List[str]] = None
    summary: Optional[str] = None

class Resume(BaseModel):
    id: str
    user_id: str
    title: str
    personal_details: dict
    education: List[Education] = []
    experience: List[Experience] = []
    skills: List[str] = []
    summary: Optional[str] = None
    created_at: datetime
    updated_at: datetime
