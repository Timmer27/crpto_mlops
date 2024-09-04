import { create } from "zustand";

export const usePlotConfigStore = create((set) => ({
  plotConfig: {}, // Initial plot configuration state
  usedColumns: [], // Columns that are currently used in the plot

  // Action to update the plot configuration
  updatePlotConfig: (newConfig) =>
    set((state) => ({
      plotConfig: { ...state.plotConfig, ...newConfig },
    })),

  // Action to set used columns
  setUsedColumns: (columns) => set({ usedColumns: columns }),

  // Action to indicate that plot configuration has changed
  plotConfigChanged: () => {
    // Logic to handle plot config change can go here
    console.log("Plot configuration has changed");
  },
}));