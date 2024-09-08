from pydantic import BaseModel

class Candle(BaseModel):
    symbol: str
    interval: str
    datetime: str  # Convert to ISO format string
    open: float
    high: float
    low: float
    close: float
    volume: float
    close_time: float  # Or int, depending on what the value represents
    quote_asset_volume: float
    number_of_trades: int
    taker_buy_base_asset_volume: float
    taker_buy_quote_asset_volume: float
    ignore: int
