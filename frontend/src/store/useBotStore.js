import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useBotStore = create(
  persist(
    (set, get) => ({
      availableBots: {}, // Dictionary of available bots
      selectedBot: null, // Currently selected bot's ID
      botStores: {}, // Stores individual bot-related information

      // Computed properties
      get botCount() {
        return Object.keys(get().availableBots).length;
      },
      get selectedBotObj() {
        return get().availableBots[get().selectedBot] || null;
      },
      get activeBotorUndefined() {
        return get().selectedBotObj || undefined;
      },
      get hasBots() {
        return get().botCount > 0;
      },
      get canRunBacktest() {
        return get().selectedBotObj?.canRunBacktest || false;
      },

      // Actions
      addBot: (bot) =>
        set((state) => ({
          availableBots: { ...state.availableBots, [bot.botId]: bot },
        })),
      removeBot: (botId) =>
        set((state) => {
          const { [botId]: _, ...remainingBots } = state.availableBots;
          return {
            availableBots: remainingBots,
            selectedBot: state.selectedBot === botId ? null : state.selectedBot,
          };
        }),
      selectBot: (botId) => set({ selectedBot: botId }),
      updateBot: (botId, updates) =>
        set((state) => ({
          availableBots: {
            ...state.availableBots,
            [botId]: { ...state.availableBots[botId], ...updates },
          },
        })),
      pingAll: () => {
        // Implement ping logic for all bots
        console.log("Pinging all bots...");
      },
    }),
    {
      name: "bot-storage", // name of the storage (optional)
      getStorage: () => localStorage, // (optional) by default, 'localStorage' is used
    }
  )
);
