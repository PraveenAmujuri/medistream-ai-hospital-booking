from fastapi import APIRouter, HTTPException
from google.oauth2 import id_token
from google.auth.transport import requests
from app.core.database import users_collection
from app.core.security import create_access_token

router = APIRouter(prefix="/auth/google", tags=["Auth"])

@router.post("/login")
async def google_login(token: str):
    try:
        idinfo = id_token.verify_oauth2_token(
            token,
            requests.Request(),
            audience=None
        )
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid Google token")

    email = idinfo["email"]
    google_id = idinfo["sub"]
    name = idinfo.get("name")

    user = await users_collection.find_one({
        "email": email,
        "provider": "google"
    })

    if not user:
        user = {
            "email": email,
            "username": email.split("@")[0],
            "google_id": google_id,
            "name": name,
            "role": "user",
            "provider": "google"
        }
        await users_collection.insert_one(user)

    token = create_access_token({
        "email": email,
        "role": user["role"]
    })

    return {"access_token": token}
