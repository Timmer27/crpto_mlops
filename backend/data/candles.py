from exchanges.base_api import get_api_instance
from utils.db import get_connection, close_connection
import pandas as pd
from datetime import datetime
from models.data import Candle

def get_market_data(symbol: str, interval: str, start_date: str, end_date: str) -> list[Candle]:
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            # SQL query to fetch data between startDate and endDate
            sql = """
            SELECT `symbol`, `interval`, `datetime`, `open`, `high`, `low`, `close`, `volume`, 
                   `close_time`, `quote_asset_volume`, `number_of_trades`, 
                   `taker_buy_base_asset_volume`, `taker_buy_quote_asset_volume`, `ignore`
            FROM market_data
            WHERE `symbol` = %s AND `interval` = %s
              AND `datetime` BETWEEN %s AND %s
            """
            cursor.execute(sql, (symbol, interval, start_date, end_date))
            result = cursor.fetchall()

            if not result:
                return []

            df = pd.DataFrame(result, columns=[
                'symbol', 'interval', 'datetime', 'open', 'high', 'low', 'close', 
                'volume', 'close_time', 'quote_asset_volume', 'number_of_trades',
                'taker_buy_base_asset_volume', 'taker_buy_quote_asset_volume', 'ignore'
            ])

            candles_data = [
                Candle(
                    symbol=row['symbol'],
                    interval=row['interval'],
                    datetime=row['datetime'].isoformat() if isinstance(row['datetime'], (datetime, pd.Timestamp)) else str(row['datetime']),  # Convert to ISO format string
                    open=row['open'],
                    high=row['high'],
                    low=row['low'],
                    close=row['close'],
                    volume=row['volume'],
                    close_time=row['close_time'],  # Assuming it’s already a float or int
                    quote_asset_volume=row['quote_asset_volume'],
                    number_of_trades=row['number_of_trades'],
                    taker_buy_base_asset_volume=row['taker_buy_base_asset_volume'],
                    taker_buy_quote_asset_volume=row['taker_buy_quote_asset_volume'],
                    ignore=row['ignore']
                ) for index, row in df.iterrows()
            ]

            return candles_data
    finally:
        close_connection(connection)