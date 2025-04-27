# routes/users.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import models
from .. import schema as schemas 
from ..database import get_db

router = APIRouter(
    prefix="/prompt",
    tags=["prompt"]
)

# Create prompt
@router.post("/", response_model=schemas.PromptResponse, status_code=status.HTTP_201_CREATED)
def create_prompt(prompt: schemas.PromptCreate, db: Session = Depends(get_db)):

    db_prompt = models.Prompt(
        content=prompt.content,
        scheduled_for=prompt.scheduled_for,
        is_active=prompt.is_active

    )
    
    db.add(db_prompt)
    db.commit()
    db.refresh(db_prompt)

    return db_prompt

# Read all prompts
@router.get("/", response_model=List[schemas.PromptResponse])
def read_prompts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    prompts = db.query(models.Prompt).offset(skip).limit(limit).all()
    return prompts

# Turn prompt activity on
@router.put("/on/{prompt_id}", response_model=schemas.PromptResponse)
def update_prompt_on(prompt_id: int, db: Session = Depends(get_db)):
    db_prompt = db.query(models.Prompt).filter(models.Prompt.id == prompt_id).first()
    if db_prompt is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prompt not found"
        )

    # Ensure no active prompt exists before making this one active
    existing_prompt = db.query(models.Prompt).filter(
        models.Prompt.is_active == True
    ).first()

    if existing_prompt:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Another prompt is already active"
        )

    # Activate the prompt
    db_prompt.is_active = True
    db.commit()
    db.refresh(db_prompt)
    return db_prompt


@router.put("/off/{prompt_id}", response_model=schemas.PromptResponse)
def update_prompt_off(prompt_id: int, db: Session = Depends(get_db)):
    db_prompt = db.query(models.Prompt).filter(models.Prompt.id == prompt_id).first()
    if db_prompt is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prompt not found"
        )

    # Deactivate the prompt
    db_prompt.is_active = False
    db.commit()
    db.refresh(db_prompt)
    return db_prompt

# Delete user
@router.delete("/{prompt_id}", status_code=status.HTTP_200_OK)
def delete_prompt(prompt_id: int, db: Session = Depends(get_db)):
    db_prompt = db.query(models.Prompt).filter(models.Prompt.id == prompt_id).first()
    if db_prompt is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prompt not found"
        )
    
    db.delete(db_prompt)
    db.commit()
    return {"message":"Deleted Prompt"}