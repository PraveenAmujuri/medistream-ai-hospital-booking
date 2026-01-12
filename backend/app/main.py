from fastapi import FastAPI
from app.core.database import db

app = FastAPI(title="MediStream Backend")

@app.get("/health")
async def health():
    collections = await db.list_collection_names()
    return {
        "status": "ok",
        "collections": collections
    }
