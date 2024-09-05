import React, { useEffect, useState, useMemo } from "react";
import { Modal, Button, Spinner, FormCheck, FormSelect } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import CandleChart from "./CandleChart";
import { useBotStore } from "../../store/useBotStore";
import { useSettingsStore } from "../../store/useSettingsStore";
import { useColorStore } from "../../store/useColorStore";
import { usePlotConfigStore } from "../../store/usePlotConfigStore";

function PlotConfigurator({ columns, isVisible }) {
  return isVisible ? <div>{/* Configuration UI */}</div> : null;
}

export default function CandleChartContainer(props) {
  const [showPlotConfig, setShowPlotConfig] = useState(props.plotConfigModal);
  const [showPlotConfigModal, setShowPlotConfigModal] = useState(false);
  const [dataset, setDataset] = useState(null);
  const [strategyName, setStrategyName] = useState("");
  const [isLoadingDataset, setIsLoadingDataset] = useState(false);
  const [datasetColumns, setDatasetColumns] = useState([]);
  const [datasetLoadedColumns, setDatasetLoadedColumns] = useState([]);
  const [hasDataset, setHasDataset] = useState(false);
  const [noDatasetText, setNoDatasetText] = useState("");

  const botStore = useBotStore();
  const settingsStore = useSettingsStore();
  const plotStore = usePlotConfigStore();
  const colorStore = useColorStore();

  function refresh() {
    if (botStore.plotPair && botStore.timeframe) {
      setIsLoadingDataset(true);
      if (props.historicView) {
        botStore
          .getPairHistory({
            pair: botStore.plotPair,
            timeframe: botStore.timeframe,
            timerange: props.timerange,
            strategy: props.strategy,
            freqaimodel: props.freqaiModel,
            columns: plotStore.usedColumns,
          })
          .then(() => setIsLoadingDataset(false));
      } else {
        botStore
          .getPairCandles({
            pair: botStore.plotPair,
            timeframe: botStore.timeframe,
            columns: plotStore.usedColumns,
          })
          .then(() => setIsLoadingDataset(false));
      }
    }
  }

  useEffect(() => {
    if (!props.availablePairs.find((p) => p === botStore.plotPair)) {
      botStore.plotPair = props.availablePairs[0];
      refresh();
    }
  }, [props.availablePairs]);

  useEffect(() => {
    botStore.plotPair = botStore.selectedPair;
  }, [botStore.selectedPair]);

  useEffect(() => {
    if (!props.historicView) {
      refresh();
    }
  }, [botStore.plotPair]);

  useEffect(() => {
    const hasAllColumns = plotStore.usedColumns.some(
      (c) => datasetColumns.includes(c) && !datasetLoadedColumns.includes(c)
    );

    if (settingsStore.useReducedPairCalls && hasAllColumns) {
      refresh();
    }
  }, [plotStore.plotConfig]);

  useEffect(() => {
    setShowPlotConfig(props.plotConfigModal);
    if (botStore.selectedPair) {
      botStore.plotPair = botStore.selectedPair;
    } else if (props.availablePairs.length > 0) {
      botStore.plotPair = props.availablePairs[0];
    }
    plotStore.plotConfigChanged();
    if (!hasDataset) {
      refresh();
    }
  }, []);

  useEffect(() => {
    setDataset(
      botStore.candleData[`${botStore.plotPair}__${botStore.timeframe}`]?.data
    );
  }, [botStore.timeframe]);

  useEffect(() => {
    // setStrategyName(props.strategy || dataset?.strategy || "");
    // setDatasetColumns(dataset ? dataset.all_columns ?? dataset.columns : []);
    // setDatasetLoadedColumns(
    //   dataset ? dataset.columns ?? dataset.all_columns : []
    // );
    // setHasDataset(dataset && dataset.data.length > 0);
  }, [dataset]);

  useEffect(() => {
    const status = props.historicView
      ? botStore.historyStatus
      : botStore.candleDataStatus;

    switch (status) {
      case "not_loaded":
        setNoDatasetText("Not loaded yet.");
        break;
      case "loading":
        setNoDatasetText("Loading...");
        break;
      case "success":
        setNoDatasetText("No data available");
        break;
      case "error":
        setNoDatasetText("Failed to load data");
        break;
      default:
        setNoDatasetText("Unknown");
    }
  }, [props.historicView]);

  return (
    <div className="flex h-full">
      <div className="flex-grow flex flex-col w-full h-full">
        <div className="flex mb-0">
          <div className="ms-1 md:ms-2 flex flex-wrap md:flex-nowrap items-center w-auto">
            <span className="md:ms-2 whitespace-nowrap">
              {strategyName || "no strategy"} | {botStore.timeframe || ""}
            </span>

            <form className="md:ms-2 min-w-[7em]">
              <select
                value={botStore.plotPair}
                onChange={(e) => {
                  // console.log( 'e', e.target.value )
                  botStore.setPlotPair(e.target.value);
                }}
                className="ms-2 min-w-[7em]"
              >
                {props.availablePairs.map((pair) => (
                  <option key={pair} value={pair}>
                    {pair}
                  </option>
                ))}
              </select>
              <button
                title="Refresh chart"
                className="ms-2 px-2 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
                disabled={!botStore.plotPair || isLoadingDataset}
                onClick={refresh}
              >
                Refresh
              </button>
            </form>

            {isLoadingDataset && (
              <div className="ms-2 animate-spin">Loading...</div>
            )}
            <div className="flex flex-col">
              <div className="flex flex-row flex-wrap">
                {dataset && (
                  <>
                    <small
                      className="ms-2 whitespace-nowrap"
                      title="Long entry signals"
                    >
                      Long entries:{" "}
                      {dataset.enter_long_signals || dataset.buy_signals}
                    </small>
                    <small
                      className="ms-2 whitespace-nowrap"
                      title="Long exit signals"
                    >
                      Long exit:{" "}
                      {dataset.exit_long_signals || dataset.sell_signals}
                    </small>
                  </>
                )}
              </div>
              <div className="flex flex-row flex-wrap">
                {dataset?.enter_short_signals && (
                  <small className="ms-2 whitespace-nowrap">
                    Short entries: {dataset.enter_short_signals}
                  </small>
                )}
                {dataset?.exit_short_signals && (
                  <small className="ms-2 whitespace-nowrap">
                    Short exits: {dataset.exit_short_signals}
                  </small>
                )}
              </div>
            </div>
          </div>
          <div className="ms-auto flex items-center w-auto">
            <div className="ms-2">
              <input
                type="checkbox"
                checked={settingsStore.useHeikinAshiCandles}
                onChange={() =>
                  (settingsStore.useHeikinAshiCandles =
                    !settingsStore.useHeikinAshiCandles)
                }
              />
              <small className="whitespace-nowrap">Heikin Ashi</small>
            </div>
            <div className="ms-2">
              <PlotConfigurator
                isVisible={showPlotConfig}
                columns={datasetColumns}
              />
            </div>
            <div className="ms-2 me-0 md:me-1">
              <button
                size="sm"
                className="px-2 py-1 bg-blue-500 text-white rounded"
                onClick={() => setShowPlotConfigModal(!showPlotConfigModal)}
              >
                Configure
              </button>
            </div>
          </div>
        </div>

        <div className="flex-grow flex w-full">
          <div className="flex-grow">
            {!hasDataset ? (
              <CandleChart
                dataset={dataset}
                trades={props.trades}
                plotConfig={plotStore.plotConfig}
                heikinAshi={settingsStore.useHeikinAshiCandles}
                useUTC={settingsStore.timezone === "UTC"}
                theme={settingsStore.chartTheme}
                sliderPosition={props.sliderPosition}
                colorUp={colorStore.colorUp}
                colorDown={colorStore.colorDown}
                labelSide={settingsStore.chartLabelSide}
              />
            ) : (
              <div className="m-auto">
                {isLoadingDataset ? (
                  <div className="animate-spin">Loading...</div>
                ) : (
                  <div className="text-xl">{noDatasetText}</div>
                )}
                {botStore.historyTakesLonger && (
                  <p>This is taking longer than expected ... Hold on ...</p>
                )}
              </div>
            )}
          </div>
          {!props.plotConfigModal && showPlotConfig && (
            <div className="w-1/4">
              <PlotConfigurator
                isVisible={showPlotConfig}
                columns={datasetColumns}
              />
            </div>
          )}
        </div>
      </div>

      {props.plotConfigModal && (
        <div className="modal fade show block">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Plot Configurator</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowPlotConfigModal(false)}
                >
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <PlotConfigurator
                  isVisible={showPlotConfigModal}
                  columns={datasetColumns}
                />
              </div>
              <div className="modal-footer">
                <button
                  className="px-4 py-2 bg-gray-300 rounded"
                  onClick={() => setShowPlotConfigModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
