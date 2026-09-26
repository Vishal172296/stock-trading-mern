import React, { useState, useEffect, useContext } from "react";
import GeneralContext from "./GeneralContext";
import { Tooltip, Grow } from "@mui/material";
import {
  BarChartOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
  AutoAwesome,
} from "@mui/icons-material";

import { watchlist as initialWatchlist } from "../data/data";
import { DoughnutChart } from "./DoughnoutChart";

const WatchList = () => {
  const [stocks, setStocks] = useState(initialWatchlist);
  const [searchQuery, setSearchQuery] = useState("");

  // Live Market Simulation: tick minor price variations every 3.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks((prevStocks) => {
        // Randomly pick 1-2 stocks to update
        const indexToUpdate = Math.floor(Math.random() * prevStocks.length);
        return prevStocks.map((stock, idx) => {
          if (idx === indexToUpdate) {
            const delta = (Math.random() * 2 - 0.98).toFixed(2);
            const newPrice = Math.max(1, Number((stock.price + Number(delta)).toFixed(2)));
            const isDown = delta < 0;
            const percent = `${isDown ? "" : "+"}${((delta / stock.price) * 100).toFixed(2)}%`;
            return {
              ...stock,
              price: newPrice,
              percent,
              isDown,
            };
          }
          return stock;
        });
      });
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const filteredStocks = stocks.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const labels = filteredStocks.map((s) => s.name);
  const data = {
    labels,
    datasets: [
      {
        label: "Price",
        data: filteredStocks.map((stock) => stock.price),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 159, 64, 0.5)",
          "rgba(46, 204, 113, 0.5)",
          "rgba(155, 89, 182, 0.5)",
          "rgba(52, 152, 219, 0.5)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="watchlist-container">
      <div className="search-container">
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search eg: infy, rel, bse, nifty"
          className="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <span className="counts"> {filteredStocks.length} / {stocks.length}</span>
      </div>

      <ul className="list">
        {filteredStocks.map((stock, index) => {
          return <WatchListItem stock={stock} key={stock.name + index} />;
        })}
        {filteredStocks.length === 0 && (
          <li style={{ padding: "20px", textAlign: "center", color: "#888" }}>
            No stocks found matching "{searchQuery}"
          </li>
        )}
      </ul>

      {filteredStocks.length > 0 && <DoughnutChart data={data} />}
    </div>
  );
};

export default WatchList;

const WatchListItem = ({ stock }) => {
  const [showWatchlistActions, setShowWatchlistActions] = useState(false);
  const generalContext = useContext(GeneralContext);

  const handleMouseEnter = () => {
    setShowWatchlistActions(true);
  };

  const handleMouseLeave = () => {
    setShowWatchlistActions(false);
  };

  return (
    <li
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => generalContext.openStockChart(stock)}
      style={{ cursor: "pointer" }}
    >
      <div className="item">
        <p className={stock.isDown ? "down" : "up"}>{stock.name}</p>
        <div className="itemInfo">
          <span className="percent">{stock.percent}</span>
          {stock.isDown ? (
            <KeyboardArrowDown className="down" />
          ) : (
            <KeyboardArrowUp className="up" />
          )}
          <span className="price">{Number(stock.price).toFixed(2)}</span>
        </div>
      </div>
      {showWatchlistActions && <WatchListActions stock={stock} />}
    </li>
  );
};

const WatchListActions = ({ stock }) => {
  const generalContext = useContext(GeneralContext);

  const handleBuyClick = (e) => {
    e.stopPropagation();
    generalContext.openBuyWindow(stock);
  };

  const handleSellClick = (e) => {
    e.stopPropagation();
    generalContext.openSellWindow(stock);
  };

  const handleAnalyticsClick = (e) => {
    e.stopPropagation();
    generalContext.openStockChart(stock);
  };

  const handleAiClick = (e) => {
    e.stopPropagation();
    generalContext.openAiAnalysis(stock);
  };

  return (
    <span className="actions" onClick={(e) => e.stopPropagation()}>
      <span>
        <Tooltip
          title="Buy (B)"
          placement="top"
          arrow
          TransitionComponent={Grow}
        >
          <button className="buy" onClick={handleBuyClick}>
            Buy
          </button>
        </Tooltip>

        <Tooltip
          title="Sell (S)"
          placement="top"
          arrow
          TransitionComponent={Grow}
        >
          <button
            className="sell"
            style={{
              backgroundColor: "#ff5722",
              color: "#fff",
              marginLeft: "4px",
            }}
            onClick={handleSellClick}
          >
            Sell
          </button>
        </Tooltip>

        <Tooltip
          title="Interactive Chart (A)"
          placement="top"
          arrow
          TransitionComponent={Grow}
        >
          <button className="action" onClick={handleAnalyticsClick}>
            <BarChartOutlined className="icon" />
          </button>
        </Tooltip>

        <Tooltip
          title="Groq AI Insights"
          placement="top"
          arrow
          TransitionComponent={Grow}
        >
          <button
            className="action"
            style={{ color: "#764ba2" }}
            onClick={handleAiClick}
          >
            <AutoAwesome className="icon" />
          </button>
        </Tooltip>
      </span>
    </span>
  );
};
