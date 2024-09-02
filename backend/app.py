from flask import Flask
from flask_cors import CORS
from flask import request
from producer import produce
import json
import os
import sys
import uvicorn
from pathlib import Path

# sys.path.append(f"{os.getcwd()}/api/Utils/")
# sys.path.append(f"{os.getcwd()}/scripts/")
from data.load_data import load_data
from exchanges.base_api import get_api_instance
from Utils.user_handler import *
# from Utils.backtester import backtester
# tester=backtester()

app = Flask(__name__)
CORS(app) 

@app.route("/check")
def check():
    return "your API is up!"

@app.route("/userSession",methods=["POST"])
def login():
    content=request.json
    
    result = log_in(content)
    return {"Success":result}

@app.route("/register",methods=["POST"])
def user_handler():
    content = request.json
    
    result = register(content)
    return {"Success":result[0], "Msg":str(result[1])}

@app.route("/test",methods=["GET"])
def test_handler():

    market = "binance"
    symbol = "BTCUSDT"
    start_time='2023-12-01'
    end_time='2024-08-17'
    interval = "1d"

    load_data(market="binance", symbol="BTCUSDT", interval=interval, start_time=start_time, end_time=end_time)

    # df = api.get_ohlc_data(symbol=symbol, interval=interval, start_time=start_time, end_time=end_time)
    # data = api.load_data(symbol, interval)
    # if data is None:
    #     # api.save_data(df, symbol, interval, start_time, end_time)
    #     # print(f"Saved data for {market} - {symbol} - {interval}")
    # else:
    #     print(f"Data already exists for {market} - {symbol} - {interval}")
    # # load_data(market="binance", symbol="BTCUSDT", interval=interval, start_time=start_time, end_time=end_time)
    return {"Success": 'test'}



@app.route("/backtest",methods=["POST"])
def backtest():
    content = request.json

    asset = content["asset"]
    strategy = content["strategy"]
    start_date = content["start_date"]
    end_date=content["end_date"]
    cash = content["cash"]
    try:
        produce("g1-SCENES_TOPIC",json.dumps(content))
        result=tester.automated_test(asset,strategy,start_date,end_date,cash)
        produce("g1-RESULTS_TOPIC",json.dumps(result))
        return result
    except Exception as e:
        return str(e)

if __name__ == '__main__':
    # uvicorn.run(f"{Path(__file__).stem}:app", host="127.0.0.1", port=5001, reload=True)
    app.run(port=5001,debug=True)