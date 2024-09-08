import React, { useState } from "react";

const IndicatorsModalContainer = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const favoriteItems = [
    "Heikin Ashi",
    "Peak Activity Levels",
    "Percentile Nearest Range",
    "The Echo Forecast",
    "Trend Regularity Adaptive",
    "Trend Volume Accumulation",
    "Trendlines with Breakouts",
  ];

  const categories = [
    "Favorites",
    "My scripts",
    "Technicals",
    "Financials",
    "Community Scripts",
    "Invite-only scripts",
  ];

  return (
    <div className="w-[400px]">
      <div className="flex">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="ms-2 px-2 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          열기
        </button>
      </div>

      {isOpen ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 w-96 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold mb-4">
                Indicators, Metrics & Strategies
              </h2>
              <button
                className="cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                <p className="text-3xl font-semibold mb-4">&times;</p>
              </button>
            </div>
            <div className="mb-4">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
              />
            </div>
            <div className="flex">
              <div className="w-1/3">
                <ul className="space-y-2">
                  {categories.map((category, index) => (
                    <li
                      key={index}
                      className="hover:bg-gray-700 p-2 rounded-md"
                    >
                      {category}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="w-2/3 pl-4">
                <h3 className="text-lg font-semibold mb-2">Favorites</h3>
                <ul className="space-y-2">
                  {favoriteItems
                    .filter((item) =>
                      item.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((item, index) => (
                      <li
                        key={index}
                        className="hover:bg-gray-700 p-2 rounded-md"
                      >
                        {item}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default IndicatorsModalContainer;
