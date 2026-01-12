from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import MONGODB_URI

client = AsyncIOMotorClient(MONGODB_URI)
db = client["medistream"]

# Collections
users_collection = db["users"]
doctors_collection = db["doctors"]
appointments_collection = db["appointments"]
