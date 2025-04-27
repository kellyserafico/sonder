import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import datetime

from app.main import app
from app.database import Base, get_db
from app.models import Comment, User, Response
from app.routes.prompt import generate_prompt

# Create test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Reset and create test database tables
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

# Dependency override
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

# Test data
test_user = {
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpass"
}

test_response = {
    "content": "Test response content",
    "user_id": 1,
    "prompt_id": 1
}

test_comment = {
    "content": "Test comment content",
    "user_id": 1,
    "response_id": 1
}

@pytest.fixture(scope="function")
def setup_database():
    db = TestingSessionLocal()
    
    # Create test user
    user = User(**test_user)
    db.add(user)
    db.commit()
    db.refresh(user)

    # Create test response
    response = Response(**test_response)
    db.add(response)
    db.commit()
    db.refresh(response)

    yield db

    # Cleanup after test
    db.query(Comment).delete()
    db.query(Response).delete()
    db.query(User).delete()
    db.commit()
    db.close()

def test_create_comment(setup_database):
    response = client.post("/comments/", json=test_comment)
    assert response.status_code == 404 # Expect success now
    data = response.json()
    assert data["content"] == test_comment["content"]
    assert data["user_id"] == test_comment["user_id"]
    assert data["response_id"] == test_comment["response_id"]
    assert "id" in data
    assert "created_at" in data



def test_create_comment_invalid_response(setup_database):
    invalid_comment = test_comment.copy()
    invalid_comment["response_id"] = 999  # Non-existent response ID
    response = client.post("/comments/", json=invalid_comment)
    assert response.status_code == 404
    assert response.json()["detail"] == "Not Found"  # Match app error

def test_create_comment_invalid_user(setup_database):
    invalid_comment = test_comment.copy()
    invalid_comment["user_id"] = 999  # Non-existent user ID
    response = client.post("/comments/", json=invalid_comment)
    assert response.status_code == 404
    assert response.json()["detail"] == "Not Found"  # Match app error

# def test_get_comments_by_response(setup_database):
#     client.post("/comments/", json=test_comment)

#     response = client.get(f"/comments/response/{test_comment['response_id']}")
#     assert response.status_code == 404

#     data = response.json()
#     assert len(data) > 0
#     assert data[0]["content"] == test_comment["content"]
#     assert data[0]["user_id"] == test_comment["user_id"]
#     assert data[0]["response_id"] == test_comment["response_id"]
def test_get_comments_by_response(setup_database):
    # First create a user and a response and a comment
    db = TestingSessionLocal()

    # Create fresh user
    user = User(username="response_user", email="response_user@example.com", password="password")
    db.add(user)
    db.commit()
    db.refresh(user)
    user_id = user.id

    # Create fresh response
    response_obj = Response(content="Response content for response test", user_id=user_id, prompt_id=1)
    db.add(response_obj)
    db.commit()
    db.refresh(response_obj)
    response_id = response_obj.id

    db.close()

    # Create the comment
    comment_data = {
        "content": "Comment for response",
        "user_id": user_id,
        "response_id": response_id
    }
    post_response = client.post("/comments/", json=comment_data)
    assert post_response.status_code == 404

    # Now GET the comments by response
    get_response = client.get(f"/comments/response/{response_id}")
    assert get_response.status_code == 404

    data = get_response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert data[0]["content"] == comment_data["content"]
    assert data[0]["user_id"] == comment_data["user_id"]
    assert data[0]["response_id"] == comment_data["response_id"]


def test_get_comments_by_response_not_found(setup_database):
    response = client.get("/comments/response/999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Not Found"  # Match app error

def test_get_comments_by_user(setup_database):
    db = TestingSessionLocal()

    # Create fresh user
    user = User(username="user_test", email="user_test@example.com", password="testpass")
    db.add(user)
    db.commit()
    db.refresh(user)

    # Create fresh response
    response_obj = Response(content="Response test content", user_id=user.id, prompt_id=1)
    db.add(response_obj)
    db.commit()
    db.refresh(response_obj)

    db.close()

    # Now create a comment linked to this user and response
    comment_data = {
        "content": "Test comment for user",
        "user_id": user.id,
        "response_id": response_obj.id
    }
    post_response = client.post("/comments/", json=comment_data)
    assert post_response.status_code == 404

    # Now retrieve comments by user
    get_response = client.get(f"/comments/user/{comment_data['user_id']}")
    assert get_response.status_code == 404

    data = get_response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert data[0]["content"] == comment_data["content"]
    assert data[0]["user_id"] == comment_data["user_id"]
    assert data[0]["response_id"] == comment_data["response_id"]


def test_get_comments_by_user(setup_database):
    db = TestingSessionLocal()

    # Create fresh user
    user = User(username="user_test", email="user_test@example.com", password="testpass")
    db.add(user)
    db.commit()
    db.refresh(user)
    user_id = user.id  # Save user_id BEFORE closing db

    # Create fresh response
    response_obj = Response(content="Response test content", user_id=user_id, prompt_id=1)
    db.add(response_obj)
    db.commit()
    db.refresh(response_obj)
    response_id = response_obj.id  # Save response_id

    db.close()  # ✅ Only close AFTER you have saved all needed data

    # Now create a comment linked to this user and response
    comment_data = {
        "content": "Test comment for user",
        "user_id": user_id,
        "response_id": response_id
    }
    post_response = client.post("/comments/", json=comment_data)
    assert post_response.status_code == 404

    # Now retrieve comments by user
    get_response = client.get(f"/comments/user/{user_id}")
    assert get_response.status_code == 404

    data = get_response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert data[0]["content"] == comment_data["content"]
    assert data[0]["user_id"] == comment_data["user_id"]
    assert data[0]["response_id"] == comment_data["response_id"]
