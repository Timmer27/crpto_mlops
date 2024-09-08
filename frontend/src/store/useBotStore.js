import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
// import { useSettingsStore } from "./useSettingsStore";
// const api = useApi(userService, botId);
// const settingStore = useSettingsStore();

const api = null;
const userService = null;
const BASE_URL = 'http://localhost:5001'

export const useBotStore = create(
  persist(
    (set, get) => ({
      // api: useApi(userService, botId),
      websocketStarted: false,
      isWebserverMode: true,
      isSelected: true,
      ping: "",
      botStatusAvailable: false,
      isBotOnline: false,
      isBotLoggedIn: true,
      autoRefresh: false,
      refreshing: false,
      versionState: "",
      lastLogs: [],
      refreshRequired: true,
      trades: [],
      openTrades: [],
      tradeCount: 0,
      performanceStats: [],
      entryStats: [],
      exitStats: [],
      mixTagStats: [],
      whitelist: [],
      blacklist: [],
      profit: {},
      botState: {},
      balance: {},
      dailyStats: {},
      weeklyStats: {},
      monthlyStats: {},
      pairlistMethods: [],
      detailTradeId: null,
      selectedPair: "",
      plotPair: "",
      candleData: [],
      stake_currency: "",
      stake_currency_decimals: "",
      bot_name: "",
      candleDataStatus: "loading",
      history: {},
      historyStatus: "not_loaded",
      historyTakesLonger: false,
      strategyPlotConfig: undefined,
      strategyList: ["test strategy1", "test strategy2", "test strategy3"],
      freqaiModelList: [],
      exchangeList: [],
      strategy: {},
      pairlist: [],
      pairlistWithTimeframe: [],
      timeframe: "1d",
      currentLocks: undefined,
      backtestRunning: false,
      backtestProgress: 0.0,
      backtestStep: "none",
      backtestTradeCount: 0,
      backtestResult: undefined,
      selectedBacktestResultKey: "",
      backtestHistory: {},
      backtestHistoryList: [],
      sysInfo: {},

      showAlert: (message, type = "info") => {
        // Implement alert display logic
        console.log(`${type.toUpperCase()}: ${message}`);
      },

      // Computed properties
      get newVersion() {
        return get().version || get().versionState;
      },
      get botApiVersion() {
        return get().api_version || 1.0;
      },
      get stakeCurrency() {
        return get().stake_currency || "";
      },
      get stakeCurrencyDecimals() {
        return get().stake_currency_decimals || 3;
      },
      // get canRunBacktest() {
      //   return get().runmode === "WEBSERVER";
      // },
      // get isWebserverMode() {
      //   return get().runmode === "WEBSERVER";
      // },
      get selectedBacktestResult() {
        return (
          get().backtestHistory[get().selectedBacktestResultKey]?.strategy || {}
        );
      },
      get shortAllowed() {
        return get().short_allowed || false;
      },
      get openTradeCount() {
        return get().openTrades.length;
      },
      get isTrading() {
        return get().runmode === "LIVE" || get().runmode === "DRY_RUN";
      },
      get getTimeframe() {
        return get().timeframe || "";
      },
      // get setTimeframe(timeframe) {
      //   return set();
      // },      
      get closedTrades() {
        return get()
          .trades.filter((item) => !item.is_open)
          .sort((a, b) =>
            b.close_timestamp && a.close_timestamp
              ? b.close_timestamp - a.close_timestamp
              : b.trade_id - a.trade_id
          );
      },
      get tradeDetail() {
        let dTrade = get().openTrades.find(
          (item) => item.trade_id === get().detailTradeId
        );
        if (!dTrade) {
          dTrade = get().trades.find(
            (item) => item.trade_id === get().detailTradeId
          );
        }
        return dTrade;
      },
      get refreshNow() {
        return (
          get().autoRefresh &&
          get().isBotOnline &&
          get().runmode !== "WEBSERVER"
        );
      },
      get botName() {
        return get().bot_name || "freqtrade";
      },
      get allTrades() {
        return [...get().openTrades, ...get().trades];
      },
      get activeLocks() {
        return get().currentLocks?.locks || [];
      },

      // Actions
      botAdded: () => set({ autoRefresh: userService.getAutoRefresh() }),

      setTimeFrame: (newTimeframe) => set({ timeframe: newTimeframe }),
      
      setPlotPair: (newPlotPair) => set({ plotPair: newPlotPair }),

      async fetchPing() {
        try {
          const result = await axios.get("/ping");
          const now = Date.now();
          set({
            ping: `${result.data.status} ${now.toString()}`,
            isBotOnline: true,
          });
        } catch (error) {
          set({ isBotOnline: false });
        }
      },

      logout: () => userService.logout(),

      getLoginInfo: () => userService.getLoginInfo(),

      updateBot: (updatedBotInfo) => {
        userService.updateBot(updatedBotInfo);
      },

      setAutoRefresh: (newRefreshValue) => {
        set((state) => {
          const updatedState = { autoRefresh: newRefreshValue };
          if (newRefreshValue) {
            updatedState.refreshRequired = true;
            get().refreshFrequent();
            get().refreshSlow(true);
          }
          userService.setAutoRefresh(newRefreshValue);
          return updatedState;
        });
      },

      setIsBotOnline: (isBotOnline) => {
        set((state) => {
          const updatedState = { isBotOnline };
          if (!state.isBotOnline && isBotOnline && state.isBotLoggedIn) {
            updatedState.refreshRequired = true;
            get().refreshSlow(true);
          }
          return updatedState;
        });
      },

      async refreshSlow(forceUpdate = false) {
        if (get().refreshing && !forceUpdate) {
          return;
        }
        if (forceUpdate || get().refreshRequired) {
          try {
            set({ refreshing: true });
            const updates = [
              get().getState(),
              get().getProfit(),
              get().getTrades(),
              get().getBalance(),
              get().getWhitelist(),
              get().getBlacklist(),
            ];
            await Promise.all(updates);
            set({ refreshRequired: false });
          } finally {
            set({ refreshing: false });
          }
        }
      },

      async refreshFrequent() {
        await get().getOpenTrades();
        await get().getLocks();
      },

      setDetailTrade: (trade) => {
        set({
          detailTradeId: trade?.trade_id || null,
          selectedPair: trade ? trade.pair : get().selectedPair,
        });
      },

      async getTrades(botId, botName) {
        try {
          const pageLength = 500;
          const fetchTrades = async (limit, offset) => {
            return axios.get("/trades", {
              params: { limit, offset },
            });
          };
          const res = await fetchTrades(pageLength, 0);
          let { trades } = res.data;
          if (Array.isArray(trades)) {
            const totalTrades = res.data.total_trades;
            if (trades.length !== totalTrades) {
              do {
                const res = await fetchTrades(pageLength, trades.length);
                trades = trades.concat(res.data.trades);
              } while (trades.length !== totalTrades);
            }
            const tradesCount = trades.length;
            trades = trades.map((t) => ({
              ...t,
              botId: botId,
              botName: botName,
              botTradeId: `${botId}__${t.trade_id}`,
            }));
            set({ trades, tradeCount: tradesCount });
          }
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.error(error.response);
          }
          throw error;
        }
      },

      async getOpenTrades(botId, botName) {
        try {
          const { data } = await axios.get("/status");
          if (
            Array.isArray(get().openTrades) &&
            Array.isArray(data) &&
            (get().openTrades.length !== data.length ||
              !get().openTrades.every(
                (val, index) => val.trade_id === data[index].trade_id
              ))
          ) {
            set({ refreshRequired: true });
            get().refreshSlow(false);
          }
          if (Array.isArray(data)) {
            const openTrades = data.map((t) => ({
              ...t,
              botId: botId,
              botName: botName,
              botTradeId: `${botId}__${t.trade_id}`,
              profit_ratio: t.profit_ratio ?? -1,
            }));
            set({
              openTrades,
              selectedPair:
                get().selectedPair === ""
                  ? openTrades[0]?.pair || ""
                  : get().selectedPair,
            });
          }
        } catch (data) {
          console.error(data);
        }
      },

      getLocks: async () => {
        try {
          const result = await axios.get("/locks");
          set({ currentLocks: result.data });
        } catch (error) {
          console.error(error);
        }
      },

      async deleteLock(lockid) {
        try {
          const res = await axios.delete(`/locks/${lockid}`);
          get().showAlert(`Deleted Lock ${lockid}.`);
          set({ currentLocks: res.data });
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.error(error.response);
          }
          get().showAlert(`Failed to delete lock ${lockid}`, "danger");
        }
      },

      async getPairCandles(payload) {
        if (payload.pair && payload.timeframe) {
          set({ candleDataStatus: "loading" });
          try {
            let result = null;
            const { data } = await axios.get(`${BASE_URL}/data/pair_candles`, {
              params: payload,
            });
            result = data;
            if (result) {
              set({
                candleData: result,
                candleDataStatus: "success",
              });
            }
          } catch (err) {
            console.error(err);
            set({ candleDataStatus: "error" });
          }
        } else {
          const error = "pair or timeframe not specified";
          console.error(error);
          throw new Error(error);
        }
      },

      async getPairHistory(payload) {
        if (payload.pair && payload.timeframe) {
          set({ historyStatus: "loading", historyTakesLonger: false });
          try {
            let result = null;
            const loadingTimer = setTimeout(
              () => set({ historyTakesLonger: true }),
              10000
            );
            const timeout = 2 * 60 * 1000;
            if (
              get().botApiVersion >= 2.35 &&
              null
              // settingStore.useReducedPairCalls
            ) {
              const { data } = await axios.post("/pair_history", payload, {
                timeout,
              });
              result = data;
            } else {
              const { data } = await axios.get("/pair_history", {
                params: payload,
                timeout,
              });
              result = data;
            }
            clearTimeout(loadingTimer);
            set({
              history: {
                [`${payload.pair}__${payload.timeframe}`]: {
                  pair: payload.pair,
                  timeframe: payload.timeframe,
                  timerange: payload.timerange,
                  data: result,
                },
              },
              historyStatus: "success",
            });
          } catch (err) {
            console.error(err);
            set({ historyStatus: "error" });
            if (axios.isAxiosError(err)) {
              console.error(err.response);
              const errMsg =
                err.response?.data?.detail || "Error fetching history";
              get().showAlert(errMsg, "danger");
            }
            throw err;
          } finally {
            set({ historyTakesLonger: false });
          }
        } else {
          const error = "pair or timeframe or timerange not specified";
          console.error(error);
          throw new Error(error);
        }
      },

      async getStrategyPlotConfig() {
        try {
          const payload = {};
          if (get().isWebserverMode) {
            if (!get().strategy.strategy) {
              return Promise.reject({ data: "No strategy selected" });
            }
            payload["strategy"] = get().strategy.strategy;
          }

          const { data: plotConfig } = await api.get("/plot_config", {
            params: { ...payload },
          });
          if (plotConfig.subplots === null) {
            plotConfig.subplots = {};
          }
          set({ strategyPlotConfig: plotConfig });
          return Promise.resolve();
        } catch (data) {
          console.error(data);
          return Promise.reject(data);
        }
      },

      async getStrategyList() {
        try {
          const { data } = await api.get("/strategies");
          set({ strategyList: data.strategies });
          return Promise.resolve(data);
        } catch (error) {
          console.error(error);
          return Promise.reject(error);
        }
      },

      async getStrategy(strategy) {
        try {
          const { data } = await api.get(`/strategy/${strategy}`);
          set({ strategy: data });
          return Promise.resolve(data);
        } catch (error) {
          console.error(error);
          if (axios.isAxiosError(error)) {
            console.error(error.response);
            const errMsg =
              error.response?.data?.detail ?? "Error fetching strategy";
            get().showAlert(errMsg, "warning");
          }
          return Promise.reject(error);
        }
      },

      async getFreqAIModelList() {
        try {
          const { data } = await api.get("/freqaimodels");
          set({ freqaiModelList: data.freqaimodels });
          return Promise.resolve(data);
        } catch (error) {
          console.error(error);
          return Promise.reject(error);
        }
      },

      async getExchangeList() {
        try {
          const { data } = await api.get("/exchanges");
          set({ exchangeList: data.exchanges });
          return Promise.resolve(data.exchanges);
        } catch (error) {
          console.error(error);
          return Promise.reject(error);
        }
      },

      async getAvailablePairs(payload) {
        try {
          const { data } = await api.get("/available_pairs", {
            params: { ...payload },
          });
          set({
            pairlist: data.pairs,
            pairlistWithTimeframe: data.pair_interval,
          });
          return Promise.resolve(data);
        } catch (error) {
          console.error(error);
          return Promise.reject(error);
        }
      },

      async getPerformance() {
        try {
          const { data } = await api.get("/performance");
          set({ performanceStats: data });
          return Promise.resolve(data);
        } catch (error) {
          console.error(error);
          return Promise.reject(error);
        }
      },

      async getEntryStats() {
        try {
          const { data } = await api.get("/entries");
          set({ entryStats: data });
          return Promise.resolve(data);
        } catch (error) {
          console.error(error);
          return Promise.reject(error);
        }
      },

      async getExitStats() {
        try {
          const { data } = await api.get("/exits");
          set({ exitStats: data });
          return Promise.resolve(data);
        } catch (error) {
          console.error(error);
          return Promise.reject(error);
        }
      },

      async getMixTagStats() {
        try {
          const { data } = await api.get("/mix_tags");
          set({ mixTagStats: data });
          return Promise.resolve(data);
        } catch (error) {
          console.error(error);
          return Promise.reject(error);
        }
      },

      async getWhitelist() {
        try {
          const { data } = await api.get("/whitelist");
          set({ whitelist: data.whitelist, pairlistMethods: data.method });
          return Promise.resolve(data);
        } catch (error) {
          console.error(error);
          return Promise.reject(error);
        }
      },

      async getBlacklist() {
        try {
          const { data } = await api.get("/blacklist");
          set({ blacklist: data.blacklist });
          return Promise.resolve(data);
        } catch (error) {
          console.error(error);
          return Promise.reject(error);
        }
      },

      async getProfit() {
        try {
          const { data } = await api.get("/profit");
          set({ profit: data });
          return Promise.resolve(data);
        } catch (error) {
          console.error(error);
          return Promise.reject(error);
        }
      },

      async getBalance() {
        try {
          const { data } = await api.get("/balance");
          set({ balance: data });
          return Promise.resolve(data);
        } catch (error) {
          console.error(error);
          return Promise.reject(error);
        }
      },

      async getTimeSummary(aggregation, payload = {}) {
        const { timescale = 20 } = payload;
        try {
          const { data } = await api.get(`/${aggregation}`, {
            params: { timescale },
          });
          if (aggregation === "daily") {
            set({ dailyStats: data });
          } else if (aggregation === "weekly") {
            set({ weeklyStats: data });
          } else if (aggregation === "monthly") {
            set({ monthlyStats: data });
          }
          return Promise.resolve(data);
        } catch (error) {
          console.error(error);
          return Promise.reject(error);
        }
      },

      async getState() {
        try {
          const { data } = await api.get("/show_config");
          set({ botState: data, botStatusAvailable: true });
          return Promise.resolve(data);
        } catch (error) {
          console.error(error);
          return Promise.reject(error);
        }
      },

      async getLogs() {
        try {
          const { data } = await api.get("/logs");
          set({ lastLogs: data.logs });
          return Promise.resolve(data);
        } catch (error) {
          console.error(error);
          return Promise.reject(error);
        }
      },

      async getPairlists() {
        try {
          const { data } = await api.get("/pairlists/available");
          return Promise.resolve(data);
        } catch (error) {
          console.error(error);
          return Promise.reject(error);
        }
      },

      async evaluatePairlist(payload) {
        try {
          const { data } = await api.post("/pairlists/evaluate", payload);
          return Promise.resolve(data);
        } catch (error) {
          console.error(error);
          return Promise.reject(error);
        }
      },

      async getPairlistEvalResult(jobId) {
        try {
          const { data } = await api.get(`/pairlists/evaluate/${jobId}`);
          return Promise.resolve(data);
        } catch (error) {
          console.error(error);
          return Promise.reject(error);
        }
      },

      async getBackgroundJobStatus(jobId) {
        try {
          const { data } = await api.get(`/background/${jobId}`);
          return Promise.resolve(data);
        } catch (error) {
          console.error(error);
          return Promise.reject(error);
        }
      },

      async startBot() {
        try {
          const { data } = await api.post("/start", {});
          get().showAlert(data.status);
          return Promise.resolve(data);
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.error(error.response);
          }
          get().showAlert("Error starting bot.", "danger");
          return Promise.reject(error);
        }
      },

      async stopBot() {
        try {
          const { data } = await api.post("/stop", {});
          get().showAlert(data.status);
          return Promise.resolve(data);
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.error(error.response);
          }
          get().showAlert("Error stopping bot.", "danger");
          return Promise.reject(error);
        }
      },

      async stopBuy() {
        try {
          const { data } = await api.post("/stopbuy", {});
          get().showAlert(data.status);
          return Promise.resolve(data);
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.error(error.response);
          }
          get().showAlert("Error calling stopbuy.", "danger");
          return Promise.reject(error);
        }
      },

      async reloadConfig() {
        try {
          const { data } = await api.post("/reload_config", {});
          get().showAlert(data.status);
          return Promise.resolve(data);
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.error(error.response);
          }
          get().showAlert("Error reloading.", "danger");
          return Promise.reject(error);
        }
      },

      async deleteTrade(tradeid) {
        try {
          const { data } = await api.delete(`/trades/${tradeid}`);
          get().showAlert(data.result_msg || `Deleted Trade ${tradeid}`);
          return Promise.resolve(data);
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.error(error.response);
          }
          get().showAlert(`Failed to delete trade ${tradeid}`, "danger");
          return Promise.reject(error);
        }
      },

      async cancelOpenOrder(tradeid) {
        try {
          const { data } = await api.delete(`/trades/${tradeid}/open-order`);
          get().showAlert(
            data.result_msg || `Canceled open order for ${tradeid}`
          );
          return Promise.resolve(data);
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.error(error.response);
          }
          get().showAlert(`Failed to cancel open order ${tradeid}`, "danger");
          return Promise.reject(error);
        }
      },

      async reloadTrade(tradeid) {
        try {
          const { data } = await api.post(`/trades/${tradeid}/reload`);
          return Promise.resolve(data);
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.error(error.response);
          }
          get().showAlert(`Failed to reload trade ${tradeid}`, "danger");
          return Promise.reject(error);
        }
      },
      // Actions
      async startTrade() {
        try {
          const res = await api.post("/start_trade", {});
          return Promise.resolve(res);
        } catch (error) {
          return Promise.reject(error);
        }
      },

      async forceexit(payload) {
        try {
          const res = await api.post("/forcesell", payload);
          get().showAlert(
            `Exit order for ${payload.tradeid} created`,
            "success"
          );
          return Promise.resolve(res);
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.error(error.response);
          }
          get().showAlert(
            `Failed to create exit order for ${payload.tradeid}`,
            "danger"
          );
          return Promise.reject(error);
        }
      },

      async forceentry(payload) {
        if (payload && payload.pair) {
          try {
            const res = await api.post("/forcebuy", payload);
            get().showAlert(`Order for ${payload.pair} created.`, "success");
            return Promise.resolve(res);
          } catch (error) {
            if (axios.isAxiosError(error)) {
              console.error(error.response);
              get().showAlert(
                `Error occurred entering: '${error.response?.data?.error}'`,
                "danger"
              );
            }
            return Promise.reject(error);
          }
        }
        const error = "Pair is empty";
        console.error(error);
        return Promise.reject(error);
      },

      async addBlacklist(payload) {
        console.log(`Adding ${payload} to blacklist`);
        if (payload && payload.blacklist) {
          try {
            const result = await api.post("/blacklist", payload);
            set({ blacklist: result.data.blacklist });
            if (
              result.data.errors &&
              Object.keys(result.data.errors).length !== 0
            ) {
              const { errors } = result.data;
              Object.keys(errors).forEach((pair) => {
                get().showAlert(
                  `Error while adding pair ${pair} to Blacklist: ${errors[pair].error_msg}`,
                  "danger"
                );
              });
            } else {
              get().showAlert(`Pair ${payload.blacklist} added.`);
            }
            return Promise.resolve(result.data);
          } catch (error) {
            if (axios.isAxiosError(error)) {
              console.error(error.response);
              get().showAlert(
                `Error occurred while adding pairs to Blacklist: '${error.response?.data?.error}'`,
                "danger"
              );
            }
            return Promise.reject(error);
          }
        }
        const error = "Pair is empty";
        console.error(error);
        return Promise.reject(error);
      },

      async deleteBlacklist(blacklistPairs) {
        console.log(`Deleting ${blacklistPairs} from blacklist.`);
        if (blacklistPairs) {
          try {
            const result = await api.delete("/blacklist", {
              params: { pairs_to_delete: blacklistPairs },
              paramsSerializer: { indexes: null },
            });
            set({ blacklist: result.data.blacklist });
            if (
              result.data.errors &&
              Object.keys(result.data.errors).length !== 0
            ) {
              const { errors } = result.data;
              Object.keys(errors).forEach((pair) => {
                get().showAlert(
                  `Error while removing pair ${pair} from Blacklist: ${errors[pair].error_msg}`,
                  "danger"
                );
              });
            } else {
              get().showAlert(`Pair ${blacklistPairs} removed.`);
            }
            return Promise.resolve(result.data);
          } catch (error) {
            if (axios.isAxiosError(error)) {
              console.error(error.response);
              get().showAlert(
                `Error occurred while removing pairs from Blacklist: '${error.response?.data?.error}'`,
                "danger"
              );
            }
            return Promise.reject(error);
          }
        }
        const error = "Pair is empty";
        console.error(error);
        return Promise.reject(error);
      },

      async startBacktest(payload) {
        try {
          const result = await api.post("/backtest", payload);
          get().updateBacktestRunning(result.data);
        } catch (err) {
          console.log(err);
        }
      },

      async pollBacktest() {
        try {
          const { data } = await api.get("/backtest");
          get().updateBacktestRunning(data);
          if (!data.running && data.backtest_result) {
            get().updateBacktestResult(data.backtest_result);
          }
          if (data.status === "error") {
            get().showAlert(`Backtest failed: ${data.status_msg}.`, "danger");
          }
        } catch (err) {
          console.error(err);
        }
      },

      async removeBacktest() {
        set({ backtestHistory: {} });
        try {
          const { data } = await api.delete("/backtest");
          get().updateBacktestRunning(data);
          return Promise.resolve(data);
        } catch (err) {
          return Promise.reject(err);
        }
      },

      updateBacktestRunning(backtestStatus) {
        set({
          backtestRunning: backtestStatus.running,
          backtestProgress: backtestStatus.progress,
          backtestStep: backtestStatus.step,
          backtestTradeCount: backtestStatus.trade_count || 0,
        });
      },

      async stopBacktest() {
        try {
          const { data } = await api.get("/backtest/abort");
          get().updateBacktestRunning(data);
          return Promise.resolve(data);
        } catch (err) {
          return Promise.reject(err);
        }
      },

      async getBacktestHistory() {
        try {
          const { data } = await api.get("/backtest/history");
          set({ backtestHistoryList: data });
        } catch (err) {
          console.error(err);
        }
      },

      updateBacktestResult(backtestResult) {
        const newHistory = { ...get().backtestHistory };
        Object.entries(backtestResult.strategy).forEach(([key, strat]) => {
          const metadata = {
            ...(backtestResult.metadata[key] ?? {}),
            strategyName: key,
            notes: backtestResult.metadata[key]?.notes ?? "",
            editing: false,
          };
          const stratKey =
            backtestResult.metadata[key].run_id ??
            `${key}_${strat.total_trades}_${strat.profit_total.toFixed(3)}`;
          newHistory[stratKey] = {
            metadata,
            strategy: strat,
          };
        });
        set({
          backtestResult,
          backtestHistory: newHistory,
          selectedBacktestResultKey: Object.keys(newHistory)[0] || null,
        });
      },

      async getBacktestHistoryResult(payload) {
        try {
          const result = await api.get("/backtest/history/result", {
            params: { filename: payload.filename, strategy: payload.strategy },
          });
          if (result.data.backtest_result) {
            get().updateBacktestResult(result.data.backtest_result);
          }
        } catch (err) {
          console.error(err);
        }
      },

      async deleteBacktestHistoryResult(btHistoryEntry) {
        try {
          const { data } = await api.delete(
            `/backtest/history/${btHistoryEntry.filename}`
          );
          set({ backtestHistoryList: data });
        } catch (err) {
          console.error(err);
          return Promise.reject(err);
        }
      },

      async saveBacktestResultMetadata(payload) {
        try {
          const { data } = await api.patch(
            `/backtest/history/${payload.filename}`,
            payload
          );
          data.forEach((entry) => {
            if (entry.run_id in get().backtestHistory) {
              get().backtestHistory[entry.run_id].metadata.notes = entry.notes;
            }
          });
        } catch (err) {
          console.error(err);
          return Promise.reject(err);
        }
      },

      setBacktestResultKey(key) {
        set({ selectedBacktestResultKey: key });
      },

      removeBacktestResultFromMemory(key) {
        const history = { ...get().backtestHistory };
        delete history[key];
        const remainingKeys = Object.keys(history);
        set({
          backtestHistory: history,
          selectedBacktestResultKey: remainingKeys.length
            ? remainingKeys[0]
            : null,
        });
      },

      async getSysInfo() {
        try {
          const { data } = await api.get("/sysinfo");
          set({ sysInfo: data });
          return Promise.resolve(data);
        } catch (err) {
          return Promise.reject(err);
        }
      },

      // _handleWebsocketMessage(ws, event) {
      //   const msg = JSON.parse(event.data);
      //   switch (msg.type) {
      //     case "exception":
      //       get().showAlert(`WSException: ${msg.data}`, "danger");
      //       break;
      //     case "whitelist":
      //       set({ whitelist: msg.data });
      //       break;
      //     case "entryFill":
      //     case "exitFill":
      //     case "exitCancel":
      //     case "entryCancel":
      //       get().showNotification(msg);
      //       break;
      //     case "newCandle": {
      //       const [pair, timeframe] = msg.data;
      //       if (pair === get().plotPair) {
      //         const plotStore = usePlotConfigStore();
      //         get().getPairCandles({
      //           pair,
      //           timeframe,
      //           columns: plotStore.usedColumns,
      //         });
      //       }
      //       break;
      //     }
      //     default:
      //       console.log(`Received event ${msg.type}`);
      //       break;
      //   }
      // },

      // startWebSocket() {
      //   if (
      //     get().websocketStarted ||
      //     !get().botStatusAvailable ||
      //     get().botApiVersion < 2.2 ||
      //     get().isWebserverMode
      //   ) {
      //     return;
      //   }

      //   const { send, close } = useWebSocket(
      //     `${userService.getBaseWsUrl()}/message/ws?token=${userService.getAccessToken()}`,
      //     {
      //       autoReconnect: { delay: 10000 },
      //       onError: (ws, event) => {
      //         console.log("onError", event, ws);
      //         set({ websocketStarted: false });
      //         close();
      //       },
      //       onMessage: get()._handleWebsocketMessage,
      //       onConnected: () => {
      //         console.log("subscribing");
      //         if (!get().isWebserverMode) {
      //           set({ websocketStarted: true });
      //           const subscriptions = [
      //             "whitelist",
      //             "entryFill",
      //             "exitFill",
      //             "entryCancel",
      //             "exitCancel",
      //           ];
      //           if (get().botApiVersion >= 2.21) {
      //             subscriptions.push("newCandle");
      //           }

      //           send(
      //             JSON.stringify({
      //               type: "subscribe",
      //               data: subscriptions,
      //             })
      //           );
      //           send(
      //             JSON.stringify({
      //               type: "whitelist",
      //               data: "",
      //             })
      //           );
      //         }
      //       },
      //     }
      //   );
      // },
      showNotification(message) {
        console.log(`Notification: ${message}`);
      },

      // Example plot store placeholder function
      usePlotConfigStore() {
        return {
          usedColumns: [],
        };
      },
    }),
    {
      name: "bot-storage", // name of the storage (optional)
      getStorage: () => localStorage, // (optional) by default, 'localStorage' is used
    }
  )
);
