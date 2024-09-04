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
    <div>
      <div className="w-100 d-flex">
        <select
          id="strategy-select"
          value={localStrategy}
          onChange={handleStrategyChange}
          className="form-select"
        >
          {botStore.strategyList.map((strategy) => (
            <option key={strategy} value={strategy}>
              {strategy}
            </option>
          ))}
        </select>
        <div className="ms-1">
          <button onClick={refreshStrategyList} className="btn btn-secondary">
            <i className="mdi mdi-refresh" />
          </button>
        </div>
      </div>

      {showDetails && botStore.strategy && (
        <textarea
          value={botStore.strategy?.code || ""}
          readOnly
          className="w-100 h-100 form-control mt-2"
        ></textarea>
      )}
    </div>
  );
};

export default StrategySelect;
