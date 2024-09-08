from exchanges.base_api import get_api_instance
from utils.db import get_connection, close_connection
import pandas as pd
import json
# from database import log_trade, get_stats, update_stats

def get_market_data(symbol: str, interval: str, start_date: str, end_date: str) -> json:
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

            # If no data found
            if not result:
                return {'message': 'No data found'}

            # Convert result to DataFrame
            df = pd.DataFrame(result, columns=[
                'symbol', 'interval', 'datetime', 'open', 'high', 'low', 'close', 
                'volume', 'close_time', 'quote_asset_volume', 'number_of_trades',
                'taker_buy_base_asset_volume', 'taker_buy_quote_asset_volume', 'ignore'
            ])
            # Optionally, you can return JSON data
            return df.to_json(orient="records")  # Return the result as JSON
    finally:
        close_connection(connection)

# data = get_market_data(symbol, interval, start_date, end_date)
# if not data:
#     return jsonify({'message': 'No data found'}), 404