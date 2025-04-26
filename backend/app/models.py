from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Boolean, Date, ARRAY
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)
    password = Column(String(128))
    
    # Relationship - one user has many responses
    responses = relationship("Response", back_populates="user")


class Response(Base):
    __tablename__ = "responses"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)

    
    # Foreign key to link to users table
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    response_text = Column(Text, nullable=False)
    image = Column(Text)
    anonymous = Column(Boolean, default=False)
    date = Column(Date, default=func.current_date())
    likes = Column(Integer, default=0)

class Comment(Base):
    __tablename__ = "comments"
    
    id = Column(Integer, primary_key=True, index=True)
    response_id = Column(Integer, ForeignKey("responses.id"))
    comment_text = Column(Text, nullable=False)
    date = Column(Date, default=func.current_date())
    

