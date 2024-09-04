import React, { useState, useEffect, useRef } from "react";
// import { useSettingsStore, OpenTradeVizOptions } from "@/stores/settings";
// import { useBotStore } from "@/stores/ftbotwrapper";
import { useLocation, useHistory } from "react-router-dom";
// import BotEntry from "./BotEntry";
// import BotList from "./BotList";
// import ThemeSelect from "./ThemeSelect";
// import ReloadControl from "./ReloadControl";
// import LoginModal from "./LoginModal";
// import {
//   Nav,
//   Navbar,
//   div,
//   div,
//   div,
//   BAvatar,
//   BFormCheckbox,
//   li,
//   divDivider,
//   p,
// } from "react-bootstrap";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import { useBotStore } from "../store/useBotStore";
import { useLayoutStore } from "../store/useLayoutStore";
import { useSettingsStore } from "../store/useSettingsStore";

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
      <section toggleable="sm" dark variant="primary">
        <a className="navbar-brand" href="/">
          <img
            className="logo"
            src="@/assets/freqtrade-logo.png"
            alt="Home Logo"
          />
          <span className="navbar-brand-title d-sm-none d-md-inline">
            Freqtrade UI
          </span>
        </a>

        {/* <Nav target="nav-collapse" /> */}

        <div id="nav-collapse" className="text-center" isNav>
          <Navbar>
            {!botStore.canRunBacktest && (
              <>
                <div href="/trade">Trade</div>
                <div href="/dashboard">Dashboard</div>
              </>
            )}
            <div href="/graph">Chart</div>
            <div href="/logs">Logs</div>
            {botStore.canRunBacktest && (
              <div href="/backtest">Backtest</div>
            )}
            {/* {botStore.?.isWebserverMode &&
              botStore.botApiVersion >= 2.3 && (
                <div href="/pairlist_config">Pairlist Config</div>
              )} */}
            {/* <ThemeSelect /> */}
          </Navbar>

          <Navbar className="ms-auto w-100">
            {!settingsStore.confirmDialog && (
              <div
                className="my-auto me-5"
                title="Confirm dialog deactivated, Forced exits will be executed immediately. Be careful."
                style={{ color: "yellow" }}
              >
                <i className="mdi mdi-run-fast" />
                <i className="mdi mdi-alert" />
              </div>
            )}
            <div className="d-flex justify-content-between">
              {botStore.botCount > 1 && (
                <div
                  size="sm"
                  className="m-1"
                  noCaret
                  variant="info"
                  toggleClass="d-flex align-items-center"
                  menuClass="my-0 py-0"
                >
                  {/* <BotEntry bot={botStore.selectedBotObj} noButtons={true} /> */}
                  {/* <BotList small={true} /> */}
                </div>
              )}
              {/* <ReloadControl
                className="me-3"
                title="Confirm Dialog deactivated."
              /> */}
            </div>
            <li className="d-none d-sm-flex flex-sm-wrap flex-lg-nowrap align-items-center nav-item text-secondary me-2">
              <p className="verticalCenter small me-2">
                {(botStore.orUndefined &&
                  botStore.orUndefined.botName) ||
                  "No bot selected"}
              </p>
              {botStore.botCount === 1 && (
                <p className="verticalCenter">
                  {botStore.orUndefined &&
                  botStore.activeBotorUndefined.isBotOnline
                    ? "Online"
                    : "Offline"}
                </p>
              )}
            </li>
            {botStore.hasBots ? (
              <li className="nav-item">
                <div
                  id="avatar-drop"
                  right
                  autoClose
                  className="d-none d-sm-block"
                >
                  <li>
                    <div size="2em" button>
                      FT
                    </div>
                  </li>
                  {/* <span className="ps-3">V: {settingsStore.uiVersion}</span> */}
                  <li href="/settings">Settings</li>
                  <div className="ps-3">
                    <form checked={layoutStore.layoutLocked}>
                      Lock layout
                    </form>
                  </div>
                  {/* <li onClick={resetDynamicLayout}>
                    Reset Layout
                  </li> */}
                  {botStore.botCount === 1 && (
                    <>
                      {/* <divDivider /> */}
                      <li onClick={clickLogout}>
                        <i className="mdi mdi-logout me-1" />
                        Sign Out
                      </li>
                    </>
                  )}
                </div>
                <div className="d-block d-sm-none">
                  <div className="py-0" href="/settings" title="Settings">
                    Settings <i className="mdi mdi-cog ms-auto" />
                  </div>
                  {botStore.botCount === 1 && (
                    <div
                      className="nav-link navbar-nav"
                      href="/"
                      onClick={clickLogout}
                    >
                      Sign Out
                    </div>
                  )}
                </div>
              </li>
            ) : (
              <li>
                test
                {/* <LoginModal /> */}
              </li>
            )}
          </Navbar>
        </div>
      </section>
    </header>
  );
}

export default Header;
