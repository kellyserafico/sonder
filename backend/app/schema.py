from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr

class PasswordReset(BaseModel):
    new_password: str
    
class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    
    class Config:
        orm_mode = True

# Prompt schemas
class PromptBase(BaseModel):
    content: str
    scheduled_for: Optional[datetime] = None
    is_active: bool = False

class PromptCreate(PromptBase):
    pass

class PromptResponse(PromptBase):
    id: int
    created_at: datetime
    
    class Config:
        orm_mode = True
        
class ResponseBase(BaseModel):
    content: str
    image: str = None 

class ResponseCreate(ResponseBase):
    prompt_id: int
    anonymous: bool

class ResponseResponse(ResponseBase):
    id: int
    user_id: int
    prompt_id: int
    
    class Config:
        orm_mode = True


# Comment schemas
class CommentBase(BaseModel):
    content: str

class CommentCreate(CommentBase):
    response_id: int

class CommentResponse(CommentBase):
    id: int
    user_id: int
    response_id: int
    created_at: datetime
    
    class Config:
        orm_mode = True

# Notification schemas
class NotificationBase(BaseModel):
    type: str
    content: Optional[str] = None
    is_read: bool = False
    prompt_id: Optional[int] = None
    response_id: Optional[int] = None
    comment_id: Optional[int] = None

class NotificationCreate(NotificationBase):
    pass

class NotificationResponse(NotificationBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        orm_mode = True

class UserLogin(BaseModel):
    username: str  # This can be either username or email
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenWithUser(Token):
    user: UserResponse

class TokenData(BaseModel):
    username: Optional[str] = None