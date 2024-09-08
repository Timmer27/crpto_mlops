from fastapi import FastAPI, Request, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from producer import produce
import json
from pathlib import Path
import uvicorn
from data.etl import insert_data_into_db
from routers.user import user_router
from routers.data import data_router

app = FastAPI()

# Allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust according to your needs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router)
app.include_router(data_router)

@app.get("/check")
async def check():
    return "your API is up!"

@app.get("/test")
async def test_handler():
    market = "binance"
    symbol = "BTCUSDT"
    start_time = '2023-12-01'
    end_time = '2024-08-17'
    interval = "1d"

    insert_data_into_db(market=market, symbol=symbol, interval=interval, start_time=start_time, end_time=end_time)
    return {"Success": 'test'}

class BacktestRequest(BaseModel):
    asset: str
    strategy: str
    start_date: str
    end_date: str
    cash: float

@app.post("/backtest")
async def backtest(content: BacktestRequest):
    try:
        produce("g1-SCENES_TOPIC", json.dumps(content.dict()))
        result = tester.automated_test(
            asset=content.asset,
            strategy=content.strategy,
            start_date=content.start_date,
            end_date=content.end_date,
            cash=content.cash,
        )
        produce("g1-RESULTS_TOPIC", json.dumps(result))
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(f"{Path(__file__).stem}:app", host="127.0.0.1", port=5001, reload=True)
