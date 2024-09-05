import React from "react";
import Header from "./Header";
import ChartsView from "./charts/ChartsView";

function Home() {
  return (
    <div className="">
      <Header />
      <div className="flex p-4">
        <ChartsView />
      </div>
    </div>
  );
}

export default Home;
