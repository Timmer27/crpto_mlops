import React, { useState, useEffect, useRef } from "react";
// import { useSettingsStore, OpenTradeVizOptions } from "@/stores/settings";
import { useLocation, useHistory } from "react-router-dom";
// import BotEntry from "./BotEntry";
// import BotList from "./BotList";
// import ThemeSelect from "./ThemeSelect";
// import ReloadControl from "./ReloadControl";
// import LoginModal from "./LoginModal";
import Navbar from "react-bootstrap/Navbar";

import { useBotStore } from "../store/useBotStore";
import { useLayoutStore } from "../store/useLayoutStore";
import { useSettingsStore } from "../store/useSettingsStore";
import { Button } from "react-bootstrap";

function Header() {
  const botStore = useBotStore();
  const settingsStore = useSettingsStore();
  const layoutStore = useLayoutStore();
  const location = useLocation();
  //   const history = useHistory();

  const [favicon, setFavicon] = useState(null);
  const [pingInterval, setPingInterval] = useState(null);

  const clickLogout = async () => {
    botStore.removeBot(botStore.selectedBot);
    // await history.push("/");
  };

  //   useEffect(() => {
  //     const initFavicon = () => {
  //       setFavicon(
  //         new Favico({
  //           animation: "none",
  //         })
  //       );
  //     };

  //     const setOpenTradesAsPill = (tradeCount) => {
  //       if (!favicon) initFavicon();
  //       if (
  //         tradeCount !== 0 &&
  //         settingsStore.openTradesInTitle === OpenTradeVizOptions.showPill
  //       ) {
  //         favicon.badge(tradeCount);
  //       } else {
  //         favicon.reset();
  //         console.log("reset");
  //       }
  //     };

  //     const resetDynamicLayout = () => {
  //       console.log(`resetLayout called for ${location.pathname}`);
  //       switch (location.pathname) {
  //         case "/trade":
  //           layoutStore.resetTradingLayout();
  //           break;
  //         case "/dashboard":
  //           layoutStore.resetDashboardLayout();
  //           break;
  //         default:
  //       }
  //     };

  //     const setTitle = () => {
  //       let title = "freqUI";
  //       if (settingsStore.openTradesInTitle === OpenTradeVizOptions.asTitle) {
  //         title = `(${botStore.orUndefined?.openTradeCount}) ${title}`;
  //       }
  //       if (botStore.orUndefined?.botName) {
  //         title = `${title} - ${botStore.orUndefined?.botName}`;
  //       }
  //       document.title = title;
  //     };

  //     const handleSettingsStoreChange = () => {
  //       const needsUpdate =
  //         settingsStore.openTradesInTitle !== settingsStore.openTradesInTitle;
  //       if (needsUpdate) {
  //         setTitle();
  //         setOpenTradesAsPill(botStore.orUndefined?.openTradeCount || 0);
  //       }
  //     };

  //     setTitle();
  //     settingsStore.loadUIVersion().then(() => {
  //       setPingInterval(window.setInterval(botStore.pingAll, 60000));
  //     });

  //     settingsStore.$subscribe(handleSettingsStoreChange);

  //     return () => {
  //       if (pingInterval) clearInterval(pingInterval);
  //     };
  //   }, [
  //     botStore,
  //     settingsStore,
  //     layoutStore,
  //     location.pathname,
  //     pingInterval,
  //     favicon,
  //   ]);

  //   useEffect(() => {
  //     setTitle();
  //   }, [botStore.orUndefined?.botName]);

  //   useEffect(() => {
  //     if (settingsStore.openTradesInTitle === OpenTradeVizOptions.showPill) {
  //       setOpenTradesAsPill(botStore.orUndefined?.openTradeCount || 0);
  //     } else if (
  //       settingsStore.openTradesInTitle === OpenTradeVizOptions.asTitle
  //     ) {
  //       setTitle();
  //     }
  //   }, [botStore.orUndefined?.openTradeCount]);

  return (
    <header>
      <section className="flex bg-primary text-white bg-[#5377a5] py-2">
        <a className="flex items-center min-w-fit" href="/">
          <span className="ml-2 text-xl">test trade logo</span>
        </a>
        <div id="nav-collapse" className="text-center w-full flex flex-2">
          <nav className="w-100 flex-1 flex gap-10 px-4 justify-center">
            {!botStore.canRunBacktest && (
              <>
                <a href="/trade" className="text-white">
                  Trade
                </a>
                <a href="/dashboard" className="text-white">
                  Dashboard
                </a>
              </>
            )}
            <a href="/graph" className="text-white">
              Chart
            </a>
            <a href="/logs" className="text-white">
              Logs
            </a>
            {botStore.canRunBacktest && (
              <a href="/backtest" className="text-white">
                Backtest
              </a>
            )}
            {/* {botStore.isWebserverMode &&
              botStore.botApiVersion >= 2.3 && (
                <a href="/pairlist_config" className="text-white">Pairlist Config</a>
              )} */}
            {/* <ThemeSelect /> */}
          </nav>

          <nav className="flex flex-2 justify-between">
            {!settingsStore.confirmDialog && (
              <div
                className="flex items-center text-yellow-500 my-auto me-5"
                title="Confirm dialog deactivated, Forced exits will be executed immediately. Be careful."
              >
                <i className="mdi mdi-run-fast" />
                <i className="mdi mdi-alert" />
              </div>
            )}
            <div className="flex justify-between items-center">
              {botStore.botCount > 1 && (
                <div className="m-1 p-2 bg-info text-white flex items-center">
                  {/* <BotEntry bot={botStore.selectedBotObj} noButtons={true} /> */}
                  {/* <BotList small={true} /> */}
                </div>
              )}
              {/* <ReloadControl className="me-3" title="Confirm Dialog deactivated." /> */}
            </div>
            <li className="hidden sm:flex flex-wrap lg:flex-nowrap items-center text-secondary mr-2">
              <p className="verticalCenter small mr-2">
                {botStore.orUndefined?.botName || "No bot selected"}
              </p>
              {botStore.botCount === 1 && (
                <p className="verticalCenter">
                  {botStore.orUndefined?.isBotOnline ? "Online" : "Offline"}
                </p>
              )}
            </li>
            {botStore.hasBots ? (
              <li className="nav-item">
                <div className="hidden sm:block">
                  <div className="text-xl">FT</div>
                </div>
                <li href="/settings" className="text-white">
                  Settings
                </li>
                <div className="pl-3">
                  <form>
                    <input type="checkbox" checked={layoutStore.layoutLocked} />
                    Lock layout
                  </form>
                </div>
                {botStore.botCount === 1 && (
                  <>
                    <li onClick={clickLogout} className="cursor-pointer">
                      <i className="mdi mdi-logout mr-1" />
                      Sign Out
                    </li>
                  </>
                )}
              </li>
            ) : (
              <Button className="mr-2">
                Login
                {/* <LoginModal /> */}
              </Button>
            )}
          </nav>
        </div>
      </section>
    </header>
  );
}

export default Header;
