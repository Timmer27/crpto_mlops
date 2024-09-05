import React from "react";
import Header from "./Header";
import ChartsView from "./charts/ChartsView";
import { Button } from "react-bootstrap";

function Home() {
  return (
    <div className="">
      <Header />
      <div className="flex p-4">
        <ChartsView />
        <div className="w-[400px]">
          <button className="border cursor-pointer p-1 rounded-md bg-blue-500 text-white">
            분석
          </button>
          <button className="border cursor-pointer p-1 rounded-md bg-blue-500 text-white">
            입력
          </button>
          <div className="border p-2 w-full h-full">
            <div className="border rounded-md p-2 my-2">
              <div className="flex">
                <div className="flex-1">symbol</div>
                <div className="flex-1">BTCUSDT</div>
              </div>
              <div className="flex">
                <div className="flex-1">interval</div>
                <div className="flex-1">1d</div>
              </div>
              <div className="flex">
                <div className="flex-1">datetime</div>
                <div className="flex-1">2024-01-01</div>
              </div>
              <div className="flex">
                <div className="flex-1">position</div>
                <div className="flex-1">LONG</div>
              </div>
            </div>
            <div className="border rounded-md p-2 my-2">
              <div className="flex">
                <div className="flex-1">symbol</div>
                <div className="flex-1">BTCUSDT</div>
              </div>
              <div className="flex">
                <div className="flex-1">interval</div>
                <div className="flex-1">1d</div>
              </div>
              <div className="flex">
                <div className="flex-1">datetime</div>
                <div className="flex-1">2024-01-01</div>
              </div>
              <div className="flex">
                <div className="flex-1">position</div>
                <div className="flex-1">LONG</div>
              </div>
            </div>
            <div className="border rounded-md p-2 my-2">
              <div className="flex">
                <div className="flex-1">symbol</div>
                <div className="flex-1">BTCUSDT</div>
              </div>
              <div className="flex">
                <div className="flex-1">interval</div>
                <div className="flex-1">1d</div>
              </div>
              <div className="flex">
                <div className="flex-1">datetime</div>
                <div className="flex-1">2024-01-01</div>
              </div>
              <div className="flex">
                <div className="flex-1">position</div>
                <div className="flex-1">LONG</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
