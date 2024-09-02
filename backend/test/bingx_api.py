import requests
import pandas as pd
from src.base_api import BaseAPI

class BingXAPI(BaseAPI):
    def __init__(self):
        super().__init__("bingx")

    def get_ohlc_data(self, symbol, interval, start_time=None, end_time=None):
        base_url = f"https://open-api.bingx.com/openApi/quote/v1/klines"
        params = {
            "symbol": symbol,
            "interval": interval,
            "startTime": start_time,
            "endTime": end_time,
        }
        response = requests.get(base_url, params=params)
        data = response.json()['data']

        df = pd.DataFrame(data, columns=[
            'timestamp', 'open', 'high', 'low', 'close', 'volume'
        ])

        df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')

        return df[['timestamp', 'open', 'high', 'low', 'close', 'volume']]
