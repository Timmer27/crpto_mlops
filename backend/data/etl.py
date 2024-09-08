from exchanges.base_api import get_api_instance
from utils.db import get_connection, close_connection
import pandas as pd
import time
# from database import log_trade, get_stats, update_stats


def insert_market_data(df: pd.DataFrame):
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            sql = """
            INSERT INTO market_data (
                `symbol`, `interval`, `datetime`, `open`,
                `high`, `low`, `close`, `volume`,
                `close_time`, `quote_asset_volume`, `number_of_trades`, `taker_buy_base_asset_volume`,
                `taker_buy_quote_asset_volume`, `ignore`
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE
                `open` = VALUES(`open`),
                `high` = VALUES(`high`),
                `low` = VALUES(`low`),
                `close` = VALUES(`close`),
                `volume` = VALUES(`volume`),
                `close_time` = VALUES(`close_time`),
                `quote_asset_volume` = VALUES(`quote_asset_volume`),
                `number_of_trades` = VALUES(`number_of_trades`),
                `taker_buy_base_asset_volume` = VALUES(`taker_buy_base_asset_volume`),
                `taker_buy_quote_asset_volume` = VALUES(`taker_buy_quote_asset_volume`),
                `ignore` = VALUES(`ignore`);
            """
            # Iterating over the DataFrame rows
            for index, row in df.iterrows():
                cursor.execute(sql, (
                    row['symbol'],
                    row['interval'],
                    row['datetime'], 
                    row['open'], 
                    row['high'], 
                    row['low'], 
                    row['close'], 
                    row['volume'], 
                    row['close_time'], 
                    row['quote_asset_volume'], 
                    row['number_of_trades'], 
                    row['taker_buy_base_asset_volume'], 
                    row['taker_buy_quote_asset_volume'], 
                    row['ignore']
                ))
        connection.commit()
    finally:
        close_connection(connection)

# markets = ["binance", "okx", "bingx", "bitget"]
# symbols = ["BTCUSDT", "ETHUSDT"]  # Example symbols
# intervals = ["1d", "30m"]   # Example intervals
# start_time='2023-12-01'
# end_time='2024-08-17'
def insert_data_into_db(market: str, symbol: str, interval: str, start_time: str, end_time: str):
    api = get_api_instance(market)

    # data = api.load_data(symbol, interval)
    df = api.get_ohlc_data(symbol=symbol, interval=interval, start_time=start_time, end_time=end_time)
    df = df.assign(
        symbol=lambda x: symbol,
        interval=lambda x: interval
    )
    insert_market_data(df=df)
    # if data is None:
    #     api.save_data(df, symbol, interval, start_time, end_time)
    #     print(f"Saved data for {market} - {symbol} - {interval}")
    # else:
    #     print(f"Data already exists for {market} - {symbol} - {interval}")