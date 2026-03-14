from fastapi import APIRouter, Depends
from app.core.dependencies import admin_required
from app.core.database import users_collection

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/users")
async def get_all_users(user=Depends(admin_required)):
    users = []
    async for u in users_collection.find():
        u["_id"] = str(u["_id"])
        users.append(u)

    return users