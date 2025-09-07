from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from datetime import timedelta
from typing import List
import uvicorn

from models import (
    UserCreate, UserLogin, User, Token, Resume, ResumeCreate, ResumeUpdate
)
from database import db
from pdf_generator import PDFGenerator
import config

app = FastAPI(title="Resume Platform API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()
pdf_generator = PDFGenerator()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    email = db.verify_token(token)
    if email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = db.get_user_by_email(email)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

# Authentication endpoints
@app.post("/auth/signup", response_model=User)
async def signup(user_data: UserCreate):
    try:
        user = db.create_user(user_data.email, user_data.password)
        return User(**user)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/auth/login", response_model=Token)
async def login(user_data: UserLogin):
    user = db.authenticate_user(user_data.email, user_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=config.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = db.create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    
    return Token(access_token=access_token, token_type="bearer")

@app.get("/auth/me", response_model=User)
async def get_current_user_profile(current_user: dict = Depends(get_current_user)):
    return User(**current_user)

# Resume endpoints
@app.post("/resume", response_model=Resume)
async def create_resume(
    resume_data: ResumeCreate, 
    current_user: dict = Depends(get_current_user)
):
    resume = db.create_resume(current_user["id"], resume_data.dict())
    return Resume(**resume)

@app.get("/resume", response_model=List[Resume])
async def get_resumes(current_user: dict = Depends(get_current_user)):
    resumes = db.get_user_resumes(current_user["id"])
    return [Resume(**resume) for resume in resumes]

@app.get("/resume/{resume_id}", response_model=Resume)
async def get_resume(
    resume_id: str, 
    current_user: dict = Depends(get_current_user)
):
    resume = db.get_resume(resume_id, current_user["id"])
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return Resume(**resume)

@app.put("/resume/{resume_id}", response_model=Resume)
async def update_resume(
    resume_id: str,
    resume_data: ResumeUpdate,
    current_user: dict = Depends(get_current_user)
):
    # Filter out None values
    update_data = {k: v for k, v in resume_data.dict().items() if v is not None}
    
    updated_resume = db.update_resume(resume_id, current_user["id"], update_data)
    if not updated_resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    return Resume(**updated_resume)

@app.delete("/resume/{resume_id}")
async def delete_resume(
    resume_id: str,
    current_user: dict = Depends(get_current_user)
):
    success = db.delete_resume(resume_id, current_user["id"])
    if not success:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    return {"message": "Resume deleted successfully"}

@app.get("/resume/{resume_id}/download")
async def download_resume_pdf(
    resume_id: str,
    current_user: dict = Depends(get_current_user)
):
    resume = db.get_resume(resume_id, current_user["id"])
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    # Generate PDF
    pdf_buffer = pdf_generator.generate_resume_pdf(resume)
    
    # Return PDF as streaming response
    return StreamingResponse(
        iter([pdf_buffer.getvalue()]),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={resume['title']}.pdf"}
    )

@app.get("/")
async def root():
    return {"message": "Resume Platform API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
