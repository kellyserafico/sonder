from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from typing import List
from .. import models
from .. import schema as schemas 
from app.database import get_db

router = APIRouter(prefix="/comment", tags=["comment"])

# Endpoint to create a new comment
@router.post("/{response_id}", response_model=schemas.CommentResponse, status_code=status.HTTP_201_CREATED)
async def create_comment(response_id: int, comment: schemas.CommentCreate, db: Session = Depends(get_db)):
    # Check if the response exists
    response = db.query(models.Response).filter(models.Response.id == response_id).first()
    if not response:
        raise HTTPException(status_code=404, detail="Response not found") 

    # Check if the user exists
    user = db.query(models.User).filter(models.User.id == comment.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Create a new Comment object
    db_comment = models.Comment(
        content=comment.content,
        user_id=comment.user_id,
        response_id=response_id
    )

    # Ensure the session is valid before operations
    try:
        db.add(db_comment)
        db.commit()
        db.refresh(db_comment)
        return db_comment
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# Endpoint to get comments for a specific response
@router.get("/response/{response_id}", response_model=List[schemas.CommentResponse])
async def get_comments_by_response(response_id: int, db: Session = Depends(get_db)):
    # Check if response exists first
    response = db.query(models.Response).filter(models.Response.id == response_id).first()
    if not response:
        raise HTTPException(status_code=404, detail="No comments found for this response")
    
    # Return comments (empty list if none found)
    try:
        comments = db.query(models.Comment).filter(models.Comment.response_id == response_id).all()
        return comments  # This will be an empty list if no comments
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


###DON"T NEED RN###
# # Endpoint to get comments by a specific user
# @router.get("/user/{user_id}", response_model=List[CommentResponse])
# async def get_comments_by_user(user_id: int, db: Session = Depends(get_db)):
#     # Check if user exists
#     try:
#         user = db.query(User).filter(User.id == user_id).first()
#         if not user:
#             raise HTTPException(status_code=404, detail="No comments found for this user")
        
#         # Get comments by user ID
#         comments = db.query(Comment).filter(Comment.user_id == user_id).all()
#         return comments  # This will be an empty list if no comments
#     except Exception as e:
#         if "DetachedInstanceError" in str(e):
#             # Refresh the session and try again
#             db.close()
#             db = next(get_db())
#             user = db.query(User).filter(User.id == user_id).first()
#             if not user:
#                 raise HTTPException(status_code=404, detail="No comments found for this user")
#             comments = db.query(Comment).filter(Comment.user_id == user_id).all()
#             return comments
#         raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
