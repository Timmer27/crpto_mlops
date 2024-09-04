import { create } from "zustand";

export const useColorStore = create((set) => ({
  colorUp: "#00ff00", // Default color for 'up' movements
  colorDown: "#ff0000", // Default color for 'down' movements

  // Action to set the 'up' color
  setColorUp: (color) => set({ colorUp: color }),

  // Action to set the 'down' color
  setColorDown: (color) => set({ colorDown: color }),
}));