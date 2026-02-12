from fastapi import APIRouter, HTTPException
from app.schemas.user import UserCreate, UserLogin
from app.core.database import users_collection
from app.core.security import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register")
async def register(user: UserCreate):
    existing = await users_collection.find_one({
        "$or": [
            {"email": user.email},
            {"username": user.username}
        ]
    })
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    doc = {
        "email": user.email,
        "username": user.username,
        "hashed_password": hash_password(user.password),
        "role": "user",
        "provider": "local"
    }

    result = await users_collection.insert_one(doc)

    token = create_access_token({
        "user_id": str(result.inserted_id),
        "role": "user"
    })

    return {
        "access_token": token,
        "user": {
            "id": str(result.inserted_id),
            "email": user.email,
            "username": user.username,
            "role": "user",
            "provider": "local"
        }
    }


@router.post("/login")
async def login(data: UserLogin):
    user = await users_collection.find_one({
        "$or": [
            {"email": data.email_or_username},
            {"username": data.email_or_username}
        ],
        "provider": "local"
    })

    if not user or not verify_password(data.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({
        "user_id": str(user["_id"]),
        "role": user["role"]
    })

    return {
        "access_token": token,
        "user": {
            "id": str(user["_id"]),
            "email": user["email"],
            "username": user["username"],
            "role": user["role"],
            "provider": "local"
        }
    }
