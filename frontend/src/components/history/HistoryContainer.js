import React, { useState } from "react";
import { HistoryInput } from "./HistoryInput";
import { HistoryLists } from "./HistoryLists";

export const HistoryContainer = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div className="w-[400px]">
        {/* <button className="border cursor-pointer p-1 rounded-md bg-blue-500 text-white">
          분석
        </button> */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="border cursor-pointer p-1 rounded-md bg-blue-500 text-white"
        >
          입력
        </button>
        <HistoryLists />
      </div>
      {isOpen ? <HistoryInput setIsOpen={setIsOpen} /> : null}
    </div>
  );
};
