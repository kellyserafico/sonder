# routes/users.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import models
from .. import schema as schemas 
from ..database import get_db
import hashlib, os

router = APIRouter(
    prefix="/response",
    tags=["response"]
)

# Create response
@router.post("/{user_id}", response_model=schemas.ResponseResponse, status_code=status.HTTP_201_CREATED)
def create_response(response: schemas.ResponseCreate, user_id: int, db: Session = Depends(get_db)):
    # Check if the user has already responded to this prompt
    existing_response = db.query(models.Response).filter(
        (models.Response.prompt_id == response.prompt_id) & 
        (models.Response.user_id == user_id) 
    ).first()
    
    if existing_response:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User has already responded to this prompt."
        )
    
    # Create the new response
    new_response = models.Response(
        prompt_id=response.prompt_id,
        user_id=user_id,
        content=response.content,
        anonymous=response.anonymous,
        image=response.image if response.image else ""

    )

    db.add(new_response)
    db.commit()
    db.refresh(new_response)

    return new_response

# Read all responses from a user
@router.get("/{user_id}", response_model=List[schemas.ResponseResponse])
def read_responses(user_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    responses = db.query(models.Response).filter(models.Response.user_id == user_id).offset(skip).limit(limit).all()
    return responses


# Update user's response
@router.put("/{user_id}/{prompt_id}", response_model=List[schemas.ResponseResponse])
def update_response(user_id: int, prompt_id: int, response: schemas.ResponseCreate, db: Session = Depends(get_db)):
    # Check if the user has already responded to this prompt
    existing_response = db.query(models.Response).filter(
        (models.Response.prompt_id == prompt_id) & 
        (models.Response.user_id == user_id) 
    ).first()
    
    if not existing_response:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Response not found."
        )
    
    # Update the response content
    existing_response.content = response.content
    existing_response.anonymous = response.anonymous
    existing_response.image = response.image if response.image else existing_response.image

    db.commit()
    db.refresh(existing_response)

    return [existing_response]

# # Update user password
# @router.put("/forgot/{user_id}", response_model=schemas.UserResponse)
# def reset_password(user_id: int, password_data: schemas.PasswordReset, db: Session = Depends(get_db)):
#     db_user = db.query(models.User).filter(models.User.id == user_id).first()
#     if db_user is None:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="User not found"
#         )
    
#     salt = os.urandom(32) 
#     password_bytes = password_data.new_password.encode()
    
#     hashed_password = hashlib.pbkdf2_hmac(
#         'sha256',
#         password_bytes,
#         salt,
#         100
#     )

#     stored_password = salt.hex() + ':' + hashed_password.hex()
    
#     # Update password
#     db_user.password = stored_password
    
#     db.commit()
#     db.refresh(db_user)
#     return db_user

# # Delete user
# @router.delete("/{user_id}")
# def delete_user(user_id: int, db: Session = Depends(get_db)):
#     db_user = db.query(models.User).filter(models.User.id == user_id).first()
#     if db_user is None:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="User not found"
#         )
    
#     db.delete(db_user)
#     db.commit()
#     return {"message":"Deleted User"}