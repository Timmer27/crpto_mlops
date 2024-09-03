import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
// import { FtWsMessageTypes } from '@/types/wsMessageTypes';

// Define OpenTradeVizOptions Enum
export const OpenTradeVizOptions = {
  showPill: "showPill",
  asTitle: "asTitle",
  noOpenTrades: "noOpenTrades",
};

// Default notification settings
// const notificationDefaults = {
//   [FtWsMessageTypes.entryFill]: true,
//   [FtWsMessageTypes.exitFill]: true,
//   [FtWsMessageTypes.entryCancel]: true,
//   [FtWsMessageTypes.exitCancel]: true,
// };

export const useSettingsStore = create(
  persist(
    (set, get) => ({
      openTradesInTitle: OpenTradeVizOptions.showPill,
      timezone: "UTC",
      backgroundSync: true,
      currentTheme: "dark",
      _uiVersion: "dev",
      useHeikinAshiCandles: false,
      useReducedPairCalls: true,
      //   notifications: notificationDefaults,
      notifications: true,
      profitDistributionBins: 20,
      confirmDialog: true,
      chartLabelSide: "right",

      // Getter methods
      get isDarkTheme() {
        const theme = getTheme(get().currentTheme);
        return theme ? theme.dark : true;
      },
      get chartTheme() {
        return get().isDarkTheme ? "dark" : "light";
      },
      get uiVersion() {
        return `${get()._uiVersion}-test`;
      },

      // Action methods
      loadUIVersion: async () => {
        if (import.meta.env.PROD) {
          try {
            const result = await axios.get("/ui_version");
            const { version } = result.data;
            set({ _uiVersion: version ?? "dev" });
          } catch (error) {
            console.error("Failed to load UI version:", error);
          }
        }
      },

      // Optionally, you can add more actions or setters here
    }),
    {
      name: "ftUISettings", // name of the storage
      getStorage: () => localStorage, // (optional) by default, 'localStorage' is used
    }
  )
);

// Utility function for theme
function getTheme(themeName) {
  // Implement theme fetching or default logic here
  // This is a placeholder; replace with actual implementation if needed
  return { dark: themeName === "dark" };
}

// // Hot module replacement (HMR) logic
// if (import.meta.hot) {
//   import.meta.hot.accept();
// }
