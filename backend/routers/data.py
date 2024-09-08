from fastapi import APIRouter, Query, HTTPException
from typing import List
from models.data import Candle
from data.candles import get_market_data 

# Define the router for data-related endpoints
data_router = APIRouter(
    prefix="/data",  # Prefix for data-related routes
    tags=["data"]
)

@data_router.get("/pair_candles", response_model=List[Candle])
async def pair_candles(pair: str = Query(...), timeframe: str = Query(...)) -> List[Candle]:
    """
    Fetches the candle data for a given pair and timeframe.
    """
    print(f"Pair: {pair}, Timeframe: {timeframe}")
    data = get_market_data(symbol=pair, interval=timeframe, start_date="2024-01-01", end_date="2024-09-01")
    
    if not data:
        raise HTTPException(status_code=404, detail="No data found")
    
    # Assume `data` is a list of dictionaries from the data source, where each dictionary contains the necessary fields.
    print('data ================>', data[0], type(data), )
    return data
