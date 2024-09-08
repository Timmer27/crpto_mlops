from fastapi import FastAPI, Request, HTTPException, Query, APIRouter
from data.candles import get_market_data
from pydantic import BaseModel

# Define the router for user-related endpoints
data_router = APIRouter(
    prefix="/user",  # This will prefix all endpoints with /user
    tags=["data_router"]  # Optional: for grouping in API docs
)

@data_router.get("/pair_candles")
async def pair_candles(pair: str = Query(...), timeframe: str = Query(...)):
    print(f"Pair: {pair}, Timeframe: {timeframe}")
    data = get_market_data(symbol=pair, interval=timeframe, start_date="2024-01-01", end_date="2024-09-01")
    if not data:
        raise HTTPException(status_code=404, detail="No data found")
    return data
