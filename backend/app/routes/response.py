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
    """Create a new response for a prompt by the user."""
    
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
        image=response.image if response.image else None
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

# Read all responses by prompt
@router.get("/prompt/{prompt_id}", response_model=List[schemas.ResponseResponse])
def read_responses(prompt_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    responses = db.query(models.Response).filter(models.Response.prompt_id == prompt_id).offset(skip).limit(limit).all()
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
    
    if not any([response.content, response.anonymous is not None, response.likes is not None, response.image is not None]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one field (content, anonymous, likes, image) must be provided."
        )
    
    # Update fields only if provided in the request
    if response.content:
        existing_response.content = response.content
    if response.anonymous is not None: 
        existing_response.anonymous = response.anonymous
    if response.image is not None: 
        existing_response.image = response.image
    if response.likes is not None: 
        existing_response.likes = response.likes

    db.commit()
    db.refresh(existing_response)

    return [existing_response]


# Delete user
@router.delete("/{response_id}", status_code=status.HTTP_200_OK)
def delete_user(response_id: int, db: Session = Depends(get_db)):
    db_response = db.query(models.Response).filter(models.Response.id == response_id).first()
    if db_response is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Response not found"
        )
    
    db.delete(db_response)
    db.commit()
    return {"message":"Deleted Response"}