import os
import hashlib
from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import get_db

# Create a new router for the password-related routes
router = APIRouter(prefix="/password", tags=["password"])

# Define the request body model for password verification
class PasswordRequest(BaseModel):
    password: str
    stored_hash: str
    stored_salt: str

# Function to verify password with stored hash and salt
def verify_password(stored_hash: bytes, stored_salt: bytes, input_password: str):
    input_password_bytes = input_password.encode()
    hashed_input_password = hashlib.pbkdf2_hmac(
        'sha256',
        input_password_bytes,
        stored_salt,
        100
    )
    return hashed_input_password == stored_hash, hashed_input_password  # Return both result and hashed password

# Endpoint to verify a password against the stored hash and salt
@router.post("/verify", status_code=status.HTTP_200_OK)
async def verify_password_endpoint(request: PasswordRequest, db: Session = Depends(get_db)):
    try:
        stored_hash = bytes.fromhex(request.stored_hash)
        stored_salt = bytes.fromhex(request.stored_salt)

        # Call the verify_password function
        is_valid, hashed_input_password = verify_password(stored_hash, stored_salt, request.password)

        if is_valid:
            # Return the success message and the hashed password (if needed)
            return {"message": "Password is correct", "hashed_password": hashed_input_password.hex()}
        else:
            raise HTTPException(status_code=400, detail="Invalid password")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error verifying password: {str(e)}")
