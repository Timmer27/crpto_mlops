import os
import pandas as pd
from datetime import datetime

def get_api_instance(market_name):
    if market_name == "binance":
        from binance_api import BinanceAPI
        return BinanceAPI()
    elif market_name == "okx":
        from okx_api import OKXAPI
        return OKXAPI()
    elif market_name == "bingx":
        from bingx_api import BingXAPI
        return BingXAPI()
    elif market_name == "bitget":
        from bitget_api import BitgetAPI
        return BitgetAPI()
    else:
        raise ValueError("Unsupported market name")

class BaseAPI:
    def __init__(self, market_name):
        self.market_name = market_name

    @staticmethod
    def _convert_time(date: str) -> int:
        return int(datetime.timestamp(pd.to_datetime(date))*1000)
    
    def get_ohlc_data(self, symbol, interval, start_time=None, end_time=None):
        raise NotImplementedError("This method needs to be implemented in subclasses")

    def save_data(self, df, symbol, interval, start_time=None, end_time=None):
        # print('sadasd', os.path.join(os.getcwd(), 'src', 'data'))
        if not os.path.exists(os.path.join(os.getcwd(), 'src', 'data')):
            os.makedirs(os.path.join(os.getcwd(), 'src', 'data'), exist_ok=True)
        
        data_name = f'{self.market_name}_{symbol}_{interval}.feather'
        file_path = os.path.join(os.getcwd(), 'src', 'data', data_name)
        # if start_time == None:
        #     file_path = f'./data/{self.market_name}_{symbol}_{interval}.feather'
        # else:
        #     file_path = f'./data/{self.market_name}_{symbol}_{interval}_{start_time}_{end_time}.feather'
        df.to_feather(file_path)

    def load_data(self, symbol, interval):
        data_name = f'{self.market_name}_{symbol}_{interval}.feather'
        file_path = os.path.join(os.getcwd(), 'src', 'data', data_name)
        # f'./data/{self.market_name}_{symbol}_{interval}.feather'
        if os.path.exists(file_path):
            return pd.read_feather(file_path)
        return None
