import React, { useState, useEffect } from "react";
import { useBotStore } from "../../store/useBotStore";

const StrategySelect = ({ modelValue, showDetails, onUpdateModelValue }) => {
  const botStore = useBotStore((state) => state);
  const [localStrategy, setLocalStrategy] = useState(modelValue);

  useEffect(() => {
    if (botStore.strategyList.length === 0) {
      botStore.getStrategyList();
    }
  }, [botStore]);

  const handleStrategyChange = (event) => {
    const newStrategy = event.target.value;
    setLocalStrategy(newStrategy);
    botStore.getStrategy(newStrategy);
    onUpdateModelValue(newStrategy);
  };

  const refreshStrategyList = () => {
    botStore.getStrategyList();
  };

  return (
    <div className="w-100 flex">
      <select
        id="strategy-select"
        value={localStrategy}
        onChange={handleStrategyChange}
        className="form-select border p-1 mx-2 rounded"
      >
        {botStore.strategyList.map((strategy) => (
          <option key={strategy} value={strategy}>
            {strategy}
          </option>
        ))}
      </select>
      <div className="flex">
        <button
          onClick={refreshStrategyList}
          className="ms-2 px-2 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          적용
        </button>
      </div>
    </div>
  );
};

{
  /* {showDetails && botStore.strategy && (
        <textarea
          value={botStore.strategy?.code || ""}
          readOnly
          className="w-100 h-100 form-control mt-2"
        />
      )} */
}

export default StrategySelect;
