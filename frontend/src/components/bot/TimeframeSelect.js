import React, { useState, useEffect, useMemo } from "react";

const TimeframeSelect = ({ value = "", belowTimeframe = "", onInput }) => {
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
    if (!belowTimeframe) {
      return availableTimeframesBase;
    }
    const idx = availableTimeframesBase.findIndex((v) => v === belowTimeframe);
    return availableTimeframesBase.slice(0, idx);
  }, [belowTimeframe]);

  // Handle change in the select box
  const handleTimeframeChange = (event) => {
    const newTimeframe = event.target.value;
    setSelectedTimeframe(newTimeframe);
    onInput(newTimeframe);
  };

  return (
    <select
      value={selectedTimeframe}
      onChange={handleTimeframeChange}
      className="form-select"
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
