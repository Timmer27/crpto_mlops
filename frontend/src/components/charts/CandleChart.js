import React, { useEffect, useRef } from "react";
// import * as echarts from "echarts";
import ReactECharts from "echarts-for-react";
import { useChartStore } from "../../store/useChartStore";

const ChartComponent = () => {
  const {
    trades,
    dataset,
    heikinAshi,
    useUTC,
    plotConfig,
    theme,
    sliderPosition,
    colorUp,
    colorDown,
    labelSide,
  } = useChartStore();

  const candleChartRef = useRef(null);
  const chartOptionsRef = useRef({});

  const initializeChartOptions = () => {
    const MARGINLEFT = labelSide === "left" ? "5.5%" : "1%";
    const MARGINRIGHT = labelSide === "left" ? "1%" : "5.5%";
    const NAMEGAP = 55;
    const SUBPLOTHEIGHT = 8; // Value in %

    chartOptionsRef.current = {
      title: [{ show: false }],
      backgroundColor: "rgba(0, 0, 0, 0)",
      useUTC: useUTC,
      animation: false,
      legend: {
        data: ["Candles", "Volume", "Entry", "Exit"],
        right: "1%",
        type: "scroll",
        pageTextStyle: { color: theme === "dark" ? "#dedede" : "#333" },
        pageIconColor: theme === "dark" ? "#aaa" : "#2f4554",
        pageIconInactiveColor: theme === "dark" ? "#2f4554" : "#aaa",
      },
      tooltip: {
        show: true,
        trigger: "axis",
        renderMode: "richText",
        backgroundColor: "rgba(80,80,80,0.7)",
        borderWidth: 0,
        textStyle: { color: "#fff" },
        axisPointer: {
          type: "cross",
          lineStyle: { color: "#cccccc", width: 1, opacity: 1 },
        },
        position(pos, params, dom, rect, size) {
          const obj = { top: 60 };
          const mouseIsLeft = pos[0] < size.viewSize[0] / 2;
          obj[["left", "right"][+mouseIsLeft]] = mouseIsLeft ? 5 : 60;
          return obj;
        },
      },
      axisPointer: {
        link: [{ xAxisIndex: "all" }],
        label: { backgroundColor: "#777" },
      },
      xAxis: [
        {
          type: "time",
          axisLine: { onZero: false },
          axisTick: { show: true },
          axisLabel: { show: true },
          axisPointer: { label: { show: false } },
          position: "top",
          splitLine: { show: false },
          splitNumber: 20,
          min: "dataMin",
          max: "dataMax",
        },
        {
          type: "time",
          gridIndex: 1,
          axisLine: { onZero: false },
          axisTick: { show: false },
          axisLabel: { show: false },
          axisPointer: { label: { show: false } },
          splitLine: { show: false },
          splitNumber: 20,
          min: "dataMin",
          max: "dataMax",
        },
      ],
      yAxis: [
        {
          scale: true,
          max: (value) => value.max + (value.max - value.min) * 0.02,
          min: (value) => value.min - (value.max - value.min) * 0.04,
          position: labelSide,
        },
        {
          scale: true,
          gridIndex: 1,
          splitNumber: 2,
          name: "volume",
          nameLocation: "middle",
          position: labelSide,
          nameGap: NAMEGAP,
          axisLabel: { show: false },
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { show: false },
        },
      ],
      dataZoom: [
        {
          type: "inside",
          xAxisIndex: [0, 1],
          start: 80,
          end: 100,
        },
        {
          xAxisIndex: [0, 1],
          bottom: 10,
          start: 80,
          end: 100,
          // Additional dataZoom properties can be added here
        },
      ],
    };

    updateChart(true);
  };

  const updateChart = (initial = false) => {
    if (!dataset) return;

    const options = {
      // Merge with existing options, logic from Vue to React here
    };

    Object.assign(chartOptionsRef.current, options);

    if (candleChartRef.current) {
      candleChartRef.current.setOption(chartOptionsRef.current, {
        replaceMerge: ["series", "grid", "yAxis", "xAxis", "legend"],
        notMerge: initial,
      });
    }
  };

  const updateSliderPosition = () => {
    if (!sliderPosition || !dataset) return;

    const start = new Date(
      sliderPosition.startValue - dataset.timeframe_ms * 40
    ).getTime();
    const end = new Date(
      sliderPosition.endValue
        ? sliderPosition.endValue + dataset.timeframe_ms * 40
        : sliderPosition.startValue + dataset.timeframe_ms * 80
    ).getTime();

    candleChartRef.current?.dispatchAction({
      type: "dataZoom",
      dataZoomIndex: 0,
      startValue: start,
      endValue: end,
    });
  };

  useEffect(() => {
    // if (!candleChartRef.current) {
    //   candleChartRef.current = echarts.init(
    //     document.getElementById("candle-chart")
    //   );
    // }
    initializeChartOptions();
    return () => {
      candleChartRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    updateChart();
  }, [trades, dataset, heikinAshi, plotConfig]);

  useEffect(() => {
    updateSliderPosition();
  }, [sliderPosition]);

  //   return <div id="candle-chart" style={{ width: "100%", height: "400px" }} />;

  const getOption = () => {
    return {
      title: {
        text: "Candlestick Chart Example",
        left: "center",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
        },
      },
      legend: {
        data: ["Candlestick"],
        top: "10%",
      },
      xAxis: {
        type: "category",
        data: [
          "2024-09-01",
          "2024-09-02",
          "2024-09-03",
          "2024-09-04",
          "2024-09-05",
          "2024-09-06",
          "2024-09-07",
          "2024-09-08",
          "2024-09-09",
          "2024-09-10",
        ],
        scale: true,
      },
      yAxis: {
        scale: true,
      },
      series: [
        {
          name: "Candlestick",
          type: "candlestick",
          data: [
            [20, 30, 10, 35], // [Open, Close, Lowest, Highest]
            [32, 45, 25, 50],
            [43, 40, 30, 45],
            [35, 50, 34, 55],
            [40, 55, 38, 60],
            [45, 60, 40, 65],
            [50, 55, 48, 60],
            [55, 60, 50, 65],
            [60, 65, 55, 70],
            [65, 70, 60, 75],
          ],
          itemStyle: {
            color: "#00ff00", // Bullish color
            color0: "#ff0000", // Bearish color
            borderColor: "#00ff00",
            borderColor0: "#ff0000",
          },
        },
      ],
    };
  };

  return (
    // <ReactECharts
    //   style={{ width: "100%", height: "400px" }}
    //   option={() => getOption()}
    //   notMerge={true}
    //   lazyUpdate={true}
    //   theme={"theme_name"}
    //   onChartReady={this.onChartReadyCallback}

    //   //   onEvents={EventsDict}
    //   //   opts={}
    // />

    <ReactECharts
        style={{ width: '100%', height: '400px' }}
        option={getOption()}
        notMerge={true}
        lazyUpdate={true}
        theme={'theme_name'} // Replace with actual theme if you have one
        // onChartReady={this.onChartReadyCallback}
        //   onEvents={EventsDict} // Uncomment and define if you have events
        //   opts={} // Add additional options if needed
      />
  );
};

export default ChartComponent;
