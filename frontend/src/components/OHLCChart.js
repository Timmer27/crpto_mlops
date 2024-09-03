import * as React from "react";
import { useEffect } from "react";
import {
  ChartComponent,
  SeriesCollectionDirective,
  AxesDirective,
  AxisDirective,
  RowDirective,
  RowsDirective,
  SeriesDirective,
  Inject,
  CandleSeries,
  Category,
  Tooltip,
  DateTime,
  Zoom,
  Logarithmic,
  StripLinesDirective,
  StripLineDirective,
  Crosshair,
  LineSeries,
  StripLine,
  MacdIndicator,
  ColumnSeries,
  IndicatorsDirective,
  IndicatorDirective,
  Legend,
} from "@syncfusion/ej2-react-charts";
import { chartValues } from "./financial-data";
import { Browser } from "@syncfusion/ej2-base";
const SAMPLE_CSS = `
    .control-fluid {
        padding: 0px !important;
    }`;

const OHLCChart = () => {
  const onChartLoad = (args) => {
    let chart = document.getElementById("charts");
    chart.setAttribute("title", "");
  };
  const load = (args) => {
    let selectedTheme = "Material";
    // selectedTheme = selectedTheme ? selectedTheme : 'Material';
    args.chart.theme = (
      selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)
    )
      .replace(/-dark/i, "Dark")
      .replace(/contrast/i, "Contrast")
      .replace(/-highContrast/i, "HighContrast");
  };
  return (
    <div className="control-pane">
      <style>{SAMPLE_CSS}</style>
      <div className="control-section">
        <ChartComponent
          id="charts"
          load={load.bind(this)}
          style={{ textAlign: "center" }}
          primaryXAxis={{
            valueType: "DateTime",
            majorGridLines: { width: 0 },
            zoomFactor: 0.2,
            zoomPosition: 0.6,
            crosshairTooltip: { enable: true },
          }}
          primaryYAxis={{
            title: "Price",
            labelFormat: "${value}",
            plotOffset: 25,
            minimum: 50,
            maximum: 170,
            interval: 30,
            rowIndex: 1,
            opposedPosition: true,
            lineStyle: { width: 0 },
          }}
          tooltip={{ enable: true, shared: true }}
          width={Browser.isDevice ? "100%" : "75%"}
          crosshair={{ enable: true, lineType: "Vertical" }}
          chartArea={{ border: { width: 0 } }}
          zoomSettings={{
            enableSelectionZooming: true,
            mode: "X",
            enablePan: true,
          }}
          title="AAPL Stock Price 2012-2017"
          legendSettings={{ visible: false }}
          loaded={onChartLoad.bind(this)}
        >
          <Inject
            services={[
              CandleSeries,
              Category,
              Tooltip,
              DateTime,
              Legend,
              Zoom,
              Logarithmic,
              Crosshair,
              LineSeries,
              MacdIndicator,
              StripLine,
              ColumnSeries,
            ]}
          />
          <RowsDirective>
            <RowDirective height={"40%"} />
            <RowDirective height={"60%"} />
          </RowsDirective>
          <AxesDirective>
            <AxisDirective
              opposedPosition={true}
              rowIndex={0}
              name="secondary"
              majorGridLines={{ width: 0 }}
              lineStyle={{ width: 0 }}
              minimum={-3.5}
              maximum={3.5}
              interval={3.5}
              majorTickLines={{ width: 0 }}
              title="MACD"
            >
              <StripLinesDirective>
                <StripLineDirective
                  start={-3.5}
                  end={3.5}
                  text=""
                  color="black"
                  visible={true}
                  opacity={0.03}
                  zIndex={"Behind"}
                />
              </StripLinesDirective>
            </AxisDirective>
          </AxesDirective>
          <SeriesCollectionDirective>
            <SeriesDirective
              dataSource={chartValues}
              width={2}
              xName="period"
              yName="y"
              low="low"
              high="high"
              close="close"
              volume="volume"
              open="open"
              name="Apple Inc"
              bearFillColor="#2ecd71"
              bullFillColor="#e74c3d"
              type="Candle"
              animation={{ enable: true }}
            />
          </SeriesCollectionDirective>
          <IndicatorsDirective>
            <IndicatorDirective
              type="Macd"
              period={3}
              fastPeriod={8}
              slowPeriod={5}
              seriesName="Apple Inc"
              macdType="Both"
              width={2}
              macdPositiveColor="#2ecd71"
              macdNegativeColor="#e74c3d"
              fill="#6063ff"
              yAxisName="secondary"
            />
          </IndicatorsDirective>
        </ChartComponent>
      </div>
    </div>
  );
};

export default OHLCChart;
