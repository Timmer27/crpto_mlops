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
    if (botStore.plotPair && props.timeframe) {
      setIsLoadingDataset(true);
      if (props.historicView) {
        botStore
          .getPairHistory({
            pair: botStore.plotPair,
            timeframe: props.timeframe,
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
            timeframe: props.timeframe,
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
    console.log('?????', props.historicView, props.timeframe)
    console.log('historicView', props.historicView)
    console.log('timeframe',props.timeframe)
    if (props.historicView) {
      setDataset(
        botStore.history[`${botStore.plotPair}__${props.timeframe}`]?.data
      );
    } else {
      setDataset(
        botStore.candleData[`${botStore.plotPair}__${props.timeframe}`]?.data
      );
    }
  }, [props.historicView, props.timeframe]);

  useEffect(() => {
    setStrategyName(props.strategy || dataset?.strategy || "");
    setDatasetColumns(dataset ? dataset.all_columns ?? dataset.columns : []);
    setDatasetLoadedColumns(
      dataset ? dataset.columns ?? dataset.all_columns : []
    );
    setHasDataset(dataset && dataset.data.length > 0);
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
    <div className="d-flex h-100">
      <div className="flex-fill w-100 flex-column align-items-stretch d-flex h-100">
        <div className="d-flex me-0">
          <div className="ms-1 ms-md-2 d-flex flex-wrap flex-md-nowrap align-items-center w-auto">
            <span className="ms-md-2 text-nowrap">
              {strategyName} | {props.timeframe || ""}
            </span>
            {/* <FormSelect
              // value={botStore.plotPair}
              value={['test1', 'test2']}
              className="ms-md-2"
              options={props.availablePairs.map((pair) => ({
                value: pair,
                label: pair,
              }))}
              styles={{ minWidth: "7em" }}
              isClearable={false}
              onChange={() => refresh()}
            /> */}
            <Form>
              <Form.Group controlId="formSelect">
                <Form.Label>Select an option</Form.Label>
                <Form.Select
                  value={botStore.plotPair}
                  onChange={() => refresh()}
                  styles={{ minWidth: "7em" }}
                  className="ms-md-2"
                >
                  {props.availablePairs.map((pair) => {
                    return <option value={pair}>pair</option>;
                  })}
                  <option value="">Choose...</option>
                  <option value="option1">Option 1</option>
                  <option value="option2">Option 2</option>
                  <option value="option3">Option 3</option>
                </Form.Select>
              </Form.Group>
              <Button
                title="Refresh chart"
                className="ms-2"
                disabled={!botStore.plotPair || isLoadingDataset}
                size="sm"
                onClick={refresh}
              >
                Refresh
              </Button>
            </Form>

            {isLoadingDataset && (
              <Spinner animation="border" size="sm" className="ms-2" />
            )}
            <div className="d-flex flex-column">
              <div className="d-flex flex-row flex-wrap">
                {dataset && (
                  <>
                    <small
                      className="ms-2 text-nowrap"
                      title="Long entry signals"
                    >
                      Long entries:{" "}
                      {dataset.enter_long_signals || dataset.buy_signals}
                    </small>
                    <small
                      className="ms-2 text-nowrap"
                      title="Long exit signals"
                    >
                      Long exit:{" "}
                      {dataset.exit_long_signals || dataset.sell_signals}
                    </small>
                  </>
                )}
              </div>
              <div className="d-flex flex-row flex-wrap">
                {dataset && dataset.enter_short_signals && (
                  <small className="ms-2 text-nowrap">
                    Short entries: {dataset.enter_short_signals}
                  </small>
                )}
                {dataset && dataset.exit_short_signals && (
                  <small className="ms-2 text-nowrap">
                    Short exits: {dataset.exit_short_signals}
                  </small>
                )}
              </div>
            </div>
          </div>
          <div className="ms-auto d-flex align-items-center w-auto">
            <FormCheck
              checked={settingsStore.useHeikinAshiCandles}
              onChange={() =>
                (settingsStore.useHeikinAshiCandles =
                  !settingsStore.useHeikinAshiCandles)
              }
              label={<small className="text-nowrap">Heikin Ashi</small>}
            />
            <div className="ms-2">
              <PlotConfigurator
                isVisible={showPlotConfig}
                columns={datasetColumns}
              />
            </div>
            <div className="ms-2 me-0 me-md-1">
              <Button
                size="sm"
                title="Plot configurator"
                onClick={() => setShowPlotConfigModal(!showPlotConfigModal)}
              >
                Configure
              </Button>
            </div>
          </div>
        </div>
        <div className="h-100 w-100 d-flex">
          <div className="flex-grow-1">
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
                    <Spinner animation="border" label="Spinning" />
                ) : (
                  <div style={{ fontSize: "1.5rem" }}>{noDatasetText}</div>
                )}
                {botStore.historyTakesLonger && (
                  <p>This is taking longer than expected ... Hold on ...</p>
                )}
              </div>
            )}
          </div>
          {!props.plotConfigModal && showPlotConfig && (
            <div className="w-25">
              <PlotConfigurator
                isVisible={showPlotConfig}
                columns={datasetColumns}
              />
            </div>
          )}
        </div>
      </div>
      {props.plotConfigModal && (
        <Modal
          show={showPlotConfigModal}
          onHide={() => setShowPlotConfigModal(false)}
          title="Plot Configurator"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Plot Configurator</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <PlotConfigurator
              isVisible={showPlotConfigModal}
              columns={datasetColumns}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowPlotConfigModal(false)}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}
