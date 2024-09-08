import React, { useState, useEffect, useMemo } from "react";
import { useBotStore } from "../../store/useBotStore";

const TimeframeSelect = ({ value = ""}) => {
  const botStore = useBotStore()
  const [selectedTimeframe, setSelectedTimeframe] = useState(value);

  // The below list must always remain sorted correctly!
  const availableTimeframesBase = [
    { value: "", text: "Use strategy default" },
    "1m",
    "3m",
    "5m",
    "15m",
    "30m",
    "1h",
    "2h",
    "4h",
    "6h",
    "8h",
    "12h",
    "1d",
    "3d",
    "1w",
    "2w",
    "1M",
    "1y",
  ];

  // Compute available timeframes based on belowTimeframe
  const availableTimeframes = useMemo(() => {
    return availableTimeframesBase;
  }, []);

  // Handle change in the select box
  const handleTimeframeChange = (event) => {
    const newTimeframe = event.target.value;
    setSelectedTimeframe(newTimeframe);
    botStore.setTimeFrame(newTimeframe);
  };

  return (
    <select
      value={selectedTimeframe}
      onChange={handleTimeframeChange}
      className="form-select border p-1 mx-2 rounded"
    >
      {availableTimeframes.map((timeframe, index) =>
        typeof timeframe === "string" ? (
          <option key={index} value={timeframe}>
            {timeframe}
          </option>
        ) : (
          <option key={index} value={timeframe.value}>
            {timeframe.text}
          </option>
        )
      )}
    </select>
  );
};

export default TimeframeSelect;
