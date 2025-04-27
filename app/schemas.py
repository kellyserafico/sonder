# from pydantic import BaseModel
# from typing import List, Optional
# from datetime import datetime

# class PromptBase(BaseModel):
#     content: str

# class PromptCreate(PromptBase):
#     pass

# class PromptResponse(PromptBase):
#     id: int
#     created_at: datetime
#     responses: List['Response'] = []

#     class Config:
#         orm_mode = True

# class ResponseBase(BaseModel):
#     content: str
#     prompt_id: int
#     user_id: int

# class ResponseCreate(ResponseBase):
#     pass

# class Response(ResponseBase):
#     id: int
#     created_at: datetime
#     prompt: 'PromptResponse'

#     class Config:
#         orm_mode = True

# class CommentBase(BaseModel):
#     content: str
#     user_id: int
#     response_id: int

# class CommentCreate(CommentBase):
#     pass

# class CommentResponse(CommentBase):
#     id: int
#     created_at: datetime

#     class Config:
#         orm_mode = True

# # Update forward references
# PromptResponse.update_forward_refs()
# Response.update_forward_refs() 
from __future__ import annotations
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class PromptBase(BaseModel):
    content: str

class PromptCreate(PromptBase):
    pass

class PromptResponse(PromptBase):
    id: int
    created_at: datetime
    responses: List[Response] = []  # <- No quotes needed anymore!

    class Config:
        orm_mode = True

class ResponseBase(BaseModel):
    content: str
    prompt_id: int
    user_id: int

class ResponseCreate(ResponseBase):
    pass

class Response(ResponseBase):
    id: int
    created_at: datetime
    prompt: PromptResponse  # <- No quotes needed anymore!

    class Config:
        orm_mode = True

class CommentBase(BaseModel):
    content: str
    user_id: int
    response_id: int

class CommentCreate(CommentBase):
    pass

class CommentResponse(CommentBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True
