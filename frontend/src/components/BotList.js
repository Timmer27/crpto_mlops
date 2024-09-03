import React, { useRef, useState, useEffect, useMemo } from "react";
import LoginModal from "@/components/LoginModal";
import BotRename from "./BotRename";
import BotEntry from "./BotEntry";
import { useBotStore } from "../store/useBotStore";

function BotList({ small = false }) {
  const botStore = useBotStore();

  const [editingBots, setEditingBots] = useState([]);
  const loginModal = useRef(null);
  const sortContainer = useRef(null);

  const botListComp = useMemo(() => {
    return Object.values(botStore.availableBots).sort(
      (a, b) => (a.sortId ?? 0) - (b.sortId ?? 0)
    );
  }, [botStore.availableBots]);

  // useEffect(() => {
  //   if (sortContainer.current) {
  //     useSortable(sortContainer.current, botListComp, {
  //       handle: ".handle",
  //       onUpdate: (e) => {
  //         const oldBotId = botListComp[e.oldIndex].botId;
  //         const newBotId = botListComp[e.newIndex].botId;
  //         botStore.updateBot(oldBotId, { sortId: e.newIndex });
  //         botStore.updateBot(newBotId, { sortId: e.oldIndex });
  //       },
  //     });
  //   }
  // }, [botListComp]);

  const editBot = (botId) => {
    if (!editingBots.includes(botId)) {
      setEditingBots([...editingBots, botId]);
    }
  };

  const editBotLogin = (botId) => {
    const loginInfo = {
      ...botStore.botStores[botId].getLoginInfo(),
      botId,
    };
    if (loginModal.current) {
      loginModal.current.openLoginModal(loginInfo);
    }
  };

  const stopEditBot = (botId) => {
    setEditingBots(editingBots.filter((id) => id !== botId));
  };

  return (
    <div>
      {botStore.botCount > 0 && (
        <>
          {!small && <h3>Available bots</h3>}
          <div ref={sortContainer}>
            {botListComp.map((bot) => (
              <div
                key={bot.botId}
                className={`list-group-item ${
                  bot.botId === botStore.selectedBot ? "active" : ""
                } d-flex align-items-center`}
                title={`${bot.botId} - ${bot.botName} - ${bot.botUrl} - ${
                  botStore.botStores[bot.botId].isBotLoggedIn
                    ? ""
                    : "Login info expired!"
                }`}
                onClick={() => botStore.selectBot(bot.botId)}
              >
                {!small && (
                  <i className="handle me-2 fs-4 mdi mdi-reorder-horizontal" />
                )}
                {editingBots.includes(bot.botId) ? (
                  <BotRename
                    bot={bot}
                    onSaved={() => stopEditBot(bot.botId)}
                    onCancelled={() => stopEditBot(bot.botId)}
                  />
                ) : (
                  <BotEntry
                    bot={bot}
                    noButtons={small}
                    onEdit={() => editBot(bot.botId)}
                    onEditLogin={() => editBotLogin(bot.botId)}
                  />
                )}
              </div>
            ))}
          </div>
          {!small && (
            <LoginModal
              ref={loginModal}
              className="mt-2"
              loginText="Add new bot"
            />
          )}
        </>
      )}
    </div>
  );
}

export default BotList;
