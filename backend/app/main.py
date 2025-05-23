# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# Import your routers here
from .routes import user, prompt, auth, response, comment, password  # Add other routes as you implement them


app = FastAPI(title="Sonder API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Specify your frontend URLs in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(user.router)
# Include other routers as you implement them
app.include_router(prompt.router)
app.include_router(response.router)
app.include_router(comment.router)
# app.include_router(notifications.router)
app.include_router(auth.router)
app.include_router(password.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Sonder API"}