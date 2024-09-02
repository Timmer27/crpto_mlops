import requests
import pandas as pd
from src.base_api import BaseAPI

class OKXAPI(BaseAPI):
    def __init__(self):
        super().__init__("okx")

    def get_ohlc_data(self, symbol, interval, start_time=None, end_time=None):
        base_url = f"https://www.okx.com/api/v5/market/candles"
        params = {
            "instId": symbol,
            "bar": interval,
            "before": start_time,
            "after": end_time,
        }
        response = requests.get(base_url, params=params)
        data = response.json()['data']

        df = pd.DataFrame(data, columns=[
            'timestamp', 'open', 'high', 'low', 'close', 'volume', 'quote_volume'
        ])

        df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')

        return df[['timestamp', 'open', 'high', 'low', 'close', 'volume']]
