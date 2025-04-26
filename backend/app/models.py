from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)
    password = Column(String(256))
    
    responses = relationship("Response", back_populates="user")
    comments = relationship("Comment", back_populates="user")
    notifications = relationship("Notification", back_populates="user")

class Prompt(Base):
    __tablename__ = "prompts"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    scheduled_for = Column(DateTime(timezone=True))
    is_active = Column(Boolean, default=False)
    
    responses = relationship("Response", back_populates="prompt")

class Response(Base):
    __tablename__ = "responses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=False) 
    image = Column(String, nullable=True)
    anonymous = Column(Boolean, default=False)
    date =  Column(DateTime(timezone=True), server_default=func.now())
    likes = Column(Integer, default=0)
    prompt_id = Column(Integer, ForeignKey("prompts.id"), nullable=False)
    
    user = relationship("User", back_populates="responses")
    prompt = relationship("Prompt", back_populates="responses")
    comments = relationship("Comment", back_populates="response")

class Comment(Base):
    __tablename__ = "comments"
    
    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    response_id = Column(Integer, ForeignKey("responses.id"), nullable=False)
    
    user = relationship("User", back_populates="comments")
    response = relationship("Response", back_populates="comments")

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String(50), nullable=False)
    content = Column(Text, nullable=True)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    prompt_id = Column(Integer, ForeignKey("prompts.id"), nullable=True)
    response_id = Column(Integer, ForeignKey("responses.id"), nullable=True)
    comment_id = Column(Integer, ForeignKey("comments.id"), nullable=True)
    
    user = relationship("User", back_populates="notifications")