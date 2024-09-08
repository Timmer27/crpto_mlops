import React, { useState } from "react";

export const HistoryInput = ({ setIsOpen }) => {
  const [formData, setFormData] = useState({
    symbol: "",
    interval: "",
    datetime: "",
    position: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-800 p-6 w-96 rounded-lg">
        <div className="w-full flex justify-end">
          <button className="cursor-pointer" onClick={() => setIsOpen(false)}>
            <p className="text-3xl font-semibold text-white">&times;</p>
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="border rounded-md p-4 my-4 space-y-4"
        >
          <div className="flex items-center space-x-4">
            <label className="w-1/3 font-semibold text-white" htmlFor="symbol">
              Symbol:
            </label>
            <input
              id="symbol"
              name="symbol"
              type="text"
              value={formData.symbol}
              onChange={handleChange}
              className="flex-1 p-2 border border-gray-300 rounded-md"
              placeholder="Enter symbol"
            />
          </div>
          <div className="flex items-center space-x-4">
            <label
              className="w-1/3 font-semibold text-white"
              htmlFor="interval"
            >
              Interval:
            </label>
            <input
              id="interval"
              name="interval"
              type="text"
              value={formData.interval}
              onChange={handleChange}
              className="flex-1 p-2 border border-gray-300 rounded-md"
              placeholder="Enter interval"
            />
          </div>
          <div className="flex items-center space-x-4">
            <label
              className="w-1/3 font-semibold text-white"
              htmlFor="datetime"
            >
              Datetime:
            </label>
            <input
              id="datetime"
              name="datetime"
              type="date"
              value={formData.datetime}
              onChange={handleChange}
              className="flex-1 p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex items-center space-x-4">
            <label
              className="w-1/3 font-semibold text-white"
              htmlFor="position"
            >
              Position:
            </label>
            <input
              id="position"
              name="position"
              type="text"
              value={formData.position}
              onChange={handleChange}
              className="flex-1 p-2 border border-gray-300 rounded-md"
              placeholder="Enter position"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};
