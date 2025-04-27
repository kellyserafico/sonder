# routes/users.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import models
from .. import schema as schemas 
from ..database import get_db
import hashlib, os

router = APIRouter(
    prefix="/user",
    tags=["user"]
)

# Create user
@router.post("/", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if user with this username or email already exists
    existing_user = db.query(models.User).filter(
        (models.User.username == user.username) | (models.User.email == user.email)
    ).first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already registered"
        )
    salt = os.urandom(32) 
    password_bytes = user.password.encode()
    
    hashed_password = hashlib.pbkdf2_hmac(
        'sha256',
        password_bytes,
        salt,
        100
    )

    stored_password = salt.hex() + ':' + hashed_password.hex()
    
    db_user = models.User(
        username=user.username,
        email=user.email,
        password=stored_password
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user

# Read all users
@router.get("/", response_model=List[schemas.UserResponse])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users

# Read user by ID
@router.get("/{user_id}", response_model=schemas.UserResponse)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return db_user


# Update user
@router.put("/{user_id}", response_model=schemas.UserResponse)
def update_user(user_id: int, user: schemas.UserBase, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Check if updating to an existing username or email
    existing_user = db.query(models.User).filter(
        ((models.User.username == user.username) | (models.User.email == user.email)) &
        (models.User.id != user_id)
    ).first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already exists"
        )
    
    # Update user fields
    db_user.username = user.username
    db_user.email = user.email
    
    db.commit()
    db.refresh(db_user)
    return db_user

# Update user password
@router.put("/forgot/{user_id}", response_model=schemas.UserResponse)
def reset_password(user_id: int, password_data: schemas.PasswordReset, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    salt = os.urandom(32) 
    password_bytes = password_data.new_password.encode()
    
    hashed_password = hashlib.pbkdf2_hmac(
        'sha256',
        password_bytes,
        salt,
        100
    )

    stored_password = salt.hex() + ':' + hashed_password.hex()
    
    # Update password
    db_user.password = stored_password
    
    db.commit()
    db.refresh(db_user)
    return db_user

# Delete user
@router.delete("/{user_id}", status_code=status.HTTP_200_OK)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    db.delete(db_user)
    db.commit()
    return {"message":"Deleted User"}