from fastapi import APIRouter
from utils.user_handler import log_in, register
from models.user import UserSessionRequest, RegisterRequest

# Define the router for user-related endpoints
user_router = APIRouter(
    prefix="/user",  # This will prefix all endpoints with /user
    tags=["user"]  # Optional: for grouping in API docs
)

@user_router.get("/test")
async def check():
    return "your user router API is up!"

@user_router.post("/userSession")
async def login(content: UserSessionRequest):
    result = log_in(content.dict())
    return {"Success": result}

@user_router.post("/register")
async def user_handler(content: RegisterRequest):
    result = register(content.dict())
    return {"Success": result[0], "Msg": str(result[1])}
