import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define your default layouts
const DEFAULT_DASHBOARD_LAYOUT = []; // Replace with actual default dashboard layout
const DEFAULT_TRADING_LAYOUT = []; // Replace with actual default trading layout
const DEFAULT_DASHBOARD_LAYOUT_SM = []; // Replace with actual default small dashboard layout
const DEFAULT_TRADING_LAYOUT_SM = []; // Replace with actual default small trading layout

const STORE_LAYOUTS = "layoutSettings";

export const useLayoutStore = create(
  persist(
    (set, get) => ({
      dashboardLayout: JSON.parse(JSON.stringify(DEFAULT_DASHBOARD_LAYOUT)),
      tradingLayout: JSON.parse(JSON.stringify(DEFAULT_TRADING_LAYOUT)),
      layoutLocked: true,

      // Getters
      getDashboardLayoutSm: () => [...DEFAULT_DASHBOARD_LAYOUT_SM],
      getTradingLayoutSm: () => [...DEFAULT_TRADING_LAYOUT_SM],

      // Actions
      resetTradingLayout: () =>
        set({
          tradingLayout: JSON.parse(JSON.stringify(DEFAULT_TRADING_LAYOUT)),
        }),
      resetDashboardLayout: () =>
        set({
          dashboardLayout: JSON.parse(JSON.stringify(DEFAULT_DASHBOARD_LAYOUT)),
        }),

      // Optional: Use `persist` options to validate and fix any issues after restoring
      afterRestore: (context) => {
        const { store } = context;

        if (
          !store.dashboardLayout ||
          typeof store.dashboardLayout === "string" ||
          !Array.isArray(store.dashboardLayout) ||
          store.dashboardLayout.length === 0 ||
          typeof store.dashboardLayout[0]?.i === "string" ||
          store.dashboardLayout.length < DEFAULT_DASHBOARD_LAYOUT.length
        ) {
          console.log("Loading dashboard layout from default.");
          set({
            dashboardLayout: JSON.parse(
              JSON.stringify(DEFAULT_DASHBOARD_LAYOUT)
            ),
          });
        }

        if (
          !store.tradingLayout ||
          typeof store.tradingLayout === "string" ||
          !Array.isArray(store.tradingLayout) ||
          store.tradingLayout.length === 0 ||
          typeof store.tradingLayout[0]?.i === "string" ||
          store.tradingLayout.length < DEFAULT_TRADING_LAYOUT.length
        ) {
          console.log("Loading trading layout from default.");
          set({
            tradingLayout: JSON.parse(JSON.stringify(DEFAULT_TRADING_LAYOUT)),
          });
        }
      },
    }),
    {
      name: STORE_LAYOUTS, // Name of the storage key
      getStorage: () => localStorage, // (optional) by default, 'localStorage' is used
      partialize: (state) => ({
        // Optional: Only persist part of the state
        dashboardLayout: state.dashboardLayout,
        tradingLayout: state.tradingLayout,
        layoutLocked: state.layoutLocked,
      }),
    }
  )
);

// // Hot Module Replacement (HMR) logic
// if (import.meta.hot) {
//   import.meta.hot.accept();
// }
