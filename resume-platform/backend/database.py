import redis
import json
import uuid
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
from passlib.context import CryptContext
from jose import jwt
import config

# Redis connection
redis_client = redis.Redis.from_url(config.REDIS_URL, db=config.REDIS_DB, decode_responses=True)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class DatabaseService:
    def __init__(self):
        self.redis_client = redis_client
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)
    
    def get_password_hash(self, password: str) -> str:
        return pwd_context.hash(password)
    
    def create_access_token(self, data: dict, expires_delta: Optional[timedelta] = None):
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=15)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, config.SECRET_KEY, algorithm=config.ALGORITHM)
        return encoded_jwt
    
    def verify_token(self, token: str) -> Optional[str]:
        try:
            payload = jwt.decode(token, config.SECRET_KEY, algorithms=[config.ALGORITHM])
            email: str = payload.get("sub")
            if email is None:
                return None
            return email
        except jwt.JWTError:
            return None
    
    # User operations
    def create_user(self, email: str, password: str) -> Dict[str, Any]:
        # Check if user exists
        if self.redis_client.hexists("users_by_email", email):
            raise ValueError("Email already registered")
        
        user_id = str(uuid.uuid4())
        hashed_password = self.get_password_hash(password)
        
        user_data = {
            "id": user_id,
            "email": email,
            "password": hashed_password,
            "created_at": datetime.utcnow().isoformat()
        }
        
        # Store user data
        self.redis_client.hset(f"user:{user_id}", mapping=user_data)
        self.redis_client.hset("users_by_email", email, user_id)
        
        # Remove password from return data
        user_data.pop("password")
        return user_data
    
    def authenticate_user(self, email: str, password: str) -> Optional[Dict[str, Any]]:
        user_id = self.redis_client.hget("users_by_email", email)
        if not user_id:
            return None
        
        user_data = self.redis_client.hgetall(f"user:{user_id}")
        if not user_data:
            return None
        
        if not self.verify_password(password, user_data["password"]):
            return None
        
        # Remove password from return data
        user_data.pop("password")
        return user_data
    
    def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        user_id = self.redis_client.hget("users_by_email", email)
        if not user_id:
            return None
        
        user_data = self.redis_client.hgetall(f"user:{user_id}")
        if not user_data:
            return None
        
        # Remove password from return data
        user_data.pop("password", None)
        return user_data
    
    def get_user_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        user_data = self.redis_client.hgetall(f"user:{user_id}")
        if not user_data:
            return None
        
        # Remove password from return data
        user_data.pop("password", None)
        return user_data
    
    # Resume operations
    def create_resume(self, user_id: str, resume_data: Dict[str, Any]) -> Dict[str, Any]:
        resume_id = str(uuid.uuid4())
        now = datetime.utcnow().isoformat()
        
        resume = {
            "id": resume_id,
            "user_id": user_id,
            "created_at": now,
            "updated_at": now,
            **resume_data
        }
        
        # Store resume
        self.redis_client.hset(f"resume:{resume_id}", mapping={
            k: json.dumps(v) if isinstance(v, (dict, list)) else v 
            for k, v in resume.items()
        })
        
        # Add to user's resume list
        self.redis_client.sadd(f"user_resumes:{user_id}", resume_id)
        
        return resume
    
    def get_user_resumes(self, user_id: str) -> List[Dict[str, Any]]:
        resume_ids = self.redis_client.smembers(f"user_resumes:{user_id}")
        resumes = []
        
        for resume_id in resume_ids:
            resume_data = self.redis_client.hgetall(f"resume:{resume_id}")
            if resume_data:
                # Parse JSON fields
                for key, value in resume_data.items():
                    if key in ["personal_details", "education", "experience", "skills"]:
                        try:
                            resume_data[key] = json.loads(value)
                        except (json.JSONDecodeError, TypeError):
                            resume_data[key] = value
                resumes.append(resume_data)
        
        return sorted(resumes, key=lambda x: x.get("updated_at", ""), reverse=True)
    
    def get_resume(self, resume_id: str, user_id: str) -> Optional[Dict[str, Any]]:
        resume_data = self.redis_client.hgetall(f"resume:{resume_id}")
        if not resume_data or resume_data.get("user_id") != user_id:
            return None
        
        # Parse JSON fields
        for key, value in resume_data.items():
            if key in ["personal_details", "education", "experience", "skills"]:
                try:
                    resume_data[key] = json.loads(value)
                except (json.JSONDecodeError, TypeError):
                    resume_data[key] = value
        
        return resume_data
    
    def update_resume(self, resume_id: str, user_id: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        # Check if resume exists and belongs to user
        existing_resume = self.redis_client.hgetall(f"resume:{resume_id}")
        if not existing_resume or existing_resume.get("user_id") != user_id:
            return None
        
        # Update timestamp
        update_data["updated_at"] = datetime.utcnow().isoformat()
        
        # Update resume
        self.redis_client.hset(f"resume:{resume_id}", mapping={
            k: json.dumps(v) if isinstance(v, (dict, list)) else v 
            for k, v in update_data.items()
        })
        
        # Return updated resume
        return self.get_resume(resume_id, user_id)
    
    def delete_resume(self, resume_id: str, user_id: str) -> bool:
        # Check if resume exists and belongs to user
        resume_data = self.redis_client.hgetall(f"resume:{resume_id}")
        if not resume_data or resume_data.get("user_id") != user_id:
            return False
        
        # Delete resume
        self.redis_client.delete(f"resume:{resume_id}")
        self.redis_client.srem(f"user_resumes:{user_id}", resume_id)
        
        return True

# Initialize database service
db = DatabaseService()

# Seed demo user
def seed_demo_user():
    try:
        demo_email = "hire-me@anshumat.org"
        demo_password = "HireMe@2025!"
        
        # Check if demo user already exists
        existing_user = db.get_user_by_email(demo_email)
        if not existing_user:
            db.create_user(demo_email, demo_password)
            print(f"Demo user created: {demo_email}")
        else:
            print(f"Demo user already exists: {demo_email}")
    except Exception as e:
        print(f"Error seeding demo user: {e}")

# Call seed function
seed_demo_user()
