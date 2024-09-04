import { create } from "zustand";

export const useChartStore = create((set) => ({
  trades: [],
  dataset: null,
  heikinAshi: false,
  useUTC: false,
  plotConfig: {},
  theme: "dark",
  sliderPosition: undefined,
  colorUp: "",
  colorDown: "",
  labelSide: "left",

  setTrades: (trades) => set({ trades }),
  setDataset: (dataset) => set({ dataset }),
  setHeikinAshi: (heikinAshi) => set({ heikinAshi }),
  setUseUTC: (useUTC) => set({ useUTC }),
  setPlotConfig: (plotConfig) => set({ plotConfig }),
  setTheme: (theme) => set({ theme }),
  setSliderPosition: (sliderPosition) => set({ sliderPosition }),
  setColorUp: (colorUp) => set({ colorUp }),
  setColorDown: (colorDown) => set({ colorDown }),
  setLabelSide: (labelSide) => set({ labelSide }),
}));
