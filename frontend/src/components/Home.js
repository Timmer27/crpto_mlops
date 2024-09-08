import React from "react";
import Header from "./Header";
import ChartsView from "./charts/ChartsView";
import { HistoryContainer } from "./history/HistoryContainer";

function Home() {
  return (
    <div className="">
      <Header />
      <div className="flex p-4">
        <ChartsView />
        <HistoryContainer />
        
      </div>
    </div>
  );
}

export default Home;
