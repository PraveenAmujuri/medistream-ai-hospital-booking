from fastapi import FastAPI
from app.routes import auth, google_auth
from fastapi import APIRouter, Depends
from app.core.dependencies import get_current_user

app = FastAPI(title="MediStream Backend")

app.include_router(auth.router)
app.include_router(google_auth.router)
router = APIRouter()
@app.get("/health")
async def health():
    return {"status": "ok"}
@router.get("/me")
async def me(user=Depends(get_current_user)):
    return user