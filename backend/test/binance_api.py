import requests
import pandas as pd
from base_api import BaseAPI
import time

class BinanceAPI(BaseAPI):
    def __init__(self):
        super().__init__("binance")
    
    # time i.e '2020-01-01'
    def get_ohlc_data(self, symbol, interval, start_time=None, end_time=None):
        base_url = "https://api.binance.com/api/v3/klines"
        data = []
        limit = 1000
        start = self._convert_time(start_time)
        end = self._convert_time(end_time)

        params = {
            "symbol": symbol,
            "interval": interval,
            "startTime": start,
            "endTime": end,
            'limit': limit,
        }
            
        while start < end:
        #         print(datetime.fromtimestamp(start // 1000))
            params['startTime'] = start
            result = requests.get(base_url, params)
            js = result.json()
            if not js:
                break
            data.extend(js)  # result에 저장
            start = js[-1][0] + 120000  # 다음 step으로

            time.sleep(0.2)

        if not data:  # 해당 기간에 데이터가 없는 경우
            print('해당 기간에 일치하는 데이터가 없습니다.')
            return -1
        
        df = pd.DataFrame(data, columns=[
            'datetime', 'open', 'high', 'low', 'close', 'volume', 
            'close_time', 'quote_asset_volume', 'number_of_trades', 
            'taker_buy_base_asset_volume', 'taker_buy_quote_asset_volume', 'ignore'
        ])
        df['datetime'] = pd.to_datetime(df['datetime'], unit='ms')
        
        return df