import React, { useState, useEffect, useMemo } from "react";
import { useBotStore } from "../../store/useBotStore";
import TimeframeSelect from "../bot/TimeframeSelect";
import CandleChartContainer from "./CandleChartContainer";
import StrategySelect from "../bot/StrategySelect";

const ChartsView = () => {
  const botStore = useBotStore();

  const [strategy, setStrategy] = useState("");
  const [timerange, setTimerange] = useState("");
  const [selectedTimeframe, setSelectedTimeframe] = useState("");

  const finalTimeframe = useMemo(() => {
    return botStore.isWebserverMode
      ? selectedTimeframe || botStore.strategy.timeframe || ""
      : botStore.getTimeframe;
  }, [selectedTimeframe, botStore]);

  // const availablePairs = useMemo(() => {
  //   if (botStore.isWebserverMode) {
  //     if (finalTimeframe && finalTimeframe !== "") {
  //       return botStore.pairlistWithTimeframe
  //         .filter(([_, timeframe]) => timeframe === finalTimeframe)
  //         .map(([pair]) => pair);
  //     }
  //     return botStore.pairlist;
  //   }
  //   return botStore.whitelist;
  // }, [finalTimeframe, botStore]);

  // useEffect(() => {
  //   if (botStore.isWebserverMode) {
  //     botStore.getAvailablePairs({
  //       timeframe: botStore.timeframe,
  //     });
  //   } else if (!botStore.whitelist || botStore.whitelist.length === 0) {
  //     botStore.getWhitelist();
  //   }
  // }, [botStore]);

  return (
    <div className="h-full w-full">
      {botStore.isWebserverMode && (
        <div className="mt-2">
          <div className="flex flex-wrap mx-1 gap-5 gap-md-2">
            <div className="col-12 col-md-3 text-start flex">
              <span>Strategy</span>
              <StrategySelect
                value={strategy}
                onChange={setStrategy}
                className="mt-1"
              />
            </div>
            <div className="col-12 col-md-3 text-start flex">
              <span>Timeframe</span>
              <TimeframeSelect className="mt-1" />
            </div>
            {/* <TimeRangeSelect value={timerange} onChange={setTimerange} /> */}
          </div>
        </div>
      )}

      <div className="mx-md-2 mt-2 pb-1 h-100">
        <CandleChartContainer
          // availablePairs={availablePairs}
          availablePairs={['BTCUSDT','ETHUSDT','XRPUSDT']}
          historicView={false}
          timeframe={finalTimeframe}
          trades={botStore.trades}
          timerange={botStore.isWebserverMode ? timerange : ""}
          strategy={botStore.isWebserverMode ? strategy : ""}
          plotConfigModal={false}
        />
      </div>
      {/* <CandleChartContainer /> */}
    </div>
  );
};

export default ChartsView;
