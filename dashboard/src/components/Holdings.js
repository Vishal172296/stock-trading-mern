import React, { useState, useEffect, useContext } from "react";
import api from "../api";
import { VerticalGraph } from "./VerticalGraph";
import GeneralContext from "./GeneralContext";

const Holdings = () => {
  const [allHoldings, setAllHoldings] = useState([]);
  const [loading, setLoading] = useState(true);

  const generalContext = useContext(GeneralContext);
  const { portfolioVersion } = generalContext;

  useEffect(() => {
    let isMounted = true;
    const fetchHoldings = async () => {
      try {
        setLoading(true);
        const res = await api.get("/allHoldings");
        if (isMounted) {
          setAllHoldings(res.data);
        }
      } catch (err) {
        console.error("Error fetching holdings:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchHoldings();
    return () => {
      isMounted = false;
    };
  }, [portfolioVersion]);

  const labels = allHoldings.map((h) => h.name);
  const graphData = {
    labels,
    datasets: [
      {
        label: "Stock Price",
        data: allHoldings.map((stock) => stock.price),
        backgroundColor: "rgba(65, 132, 243, 0.6)",
      },
    ],
  };

  let totalInvestment = 0;
  let totalCurrentValue = 0;
  allHoldings.forEach((h) => {
    totalInvestment += (h.avg || 0) * (h.qty || 0);
    totalCurrentValue += (h.price || 0) * (h.qty || 0);
  });
  const totalPnL = totalCurrentValue - totalInvestment;
  const totalPnLPercent =
    totalInvestment > 0 ? ((totalPnL / totalInvestment) * 100).toFixed(2) : 0;

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <h3 className="title" style={{ margin: 0 }}>
          Holdings ({allHoldings.length})
        </h3>
        <div style={{ fontSize: "0.85rem", color: "#666" }}>
          Total P&L:{" "}
          <strong style={{ color: totalPnL >= 0 ? "#2e7d32" : "#d32f2f" }}>
            {totalPnL >= 0 ? "+" : ""}₹{totalPnL.toFixed(2)} ({totalPnL >= 0 ? "+" : ""}
            {totalPnLPercent}%)
          </strong>
        </div>
      </div>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg. cost</th>
              <th>LTP</th>
              <th>Cur. val</th>
              <th>P&L</th>
              <th>Net chg.</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {allHoldings.map((stock, index) => {
              const curValue = (stock.price || 0) * (stock.qty || 0);
              const pnl = curValue - (stock.avg || 0) * (stock.qty || 0);
              const isProfit = pnl >= 0.0;
              const profClass = isProfit ? "profit" : "loss";

              return (
                <tr key={index}>
                  <td>
                    <strong>{stock.name}</strong>
                  </td>
                  <td>{stock.qty}</td>
                  <td>₹{Number(stock.avg || 0).toFixed(2)}</td>
                  <td>₹{Number(stock.price || 0).toFixed(2)}</td>
                  <td>₹{Number(curValue).toFixed(2)}</td>
                  <td className={profClass}>
                    {isProfit ? "+" : ""}₹{Number(pnl).toFixed(2)}
                  </td>
                  <td className={profClass}>
                    {stock.net || (isProfit ? "+0.00%" : "-0.00%")}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button
                        style={{
                          backgroundColor: "#4184f3",
                          color: "#fff",
                          border: "none",
                          padding: "3px 8px",
                          borderRadius: "3px",
                          fontSize: "0.75rem",
                          cursor: "pointer",
                        }}
                        onClick={() => generalContext.openBuyWindow(stock)}
                      >
                        Buy
                      </button>
                      <button
                        style={{
                          backgroundColor: "#ff5722",
                          color: "#fff",
                          border: "none",
                          padding: "3px 8px",
                          borderRadius: "3px",
                          fontSize: "0.75rem",
                          cursor: "pointer",
                        }}
                        onClick={() => generalContext.openSellWindow(stock)}
                      >
                        Sell
                      </button>
                      <button
                        style={{
                          backgroundColor: "#7e57c2",
                          color: "#fff",
                          border: "none",
                          padding: "3px 8px",
                          borderRadius: "3px",
                          fontSize: "0.75rem",
                          cursor: "pointer",
                        }}
                        onClick={() => generalContext.openAiAnalysis(stock)}
                      >
                        AI
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {allHoldings.length === 0 && !loading && (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", padding: "30px", color: "#888" }}>
                  No active holdings. Pick a stock from the Watchlist and click <strong>Buy</strong> to begin paper trading!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="row">
        <div className="col">
          <h5>
            ₹{totalInvestment.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </h5>
          <p>Total investment</p>
        </div>
        <div className="col">
          <h5>
            ₹{totalCurrentValue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </h5>
          <p>Current value</p>
        </div>
        <div className="col">
          <h5 className={totalPnL >= 0 ? "profit" : "loss"}>
            {totalPnL >= 0 ? "+" : ""}₹{totalPnL.toFixed(2)} ({totalPnL >= 0 ? "+" : ""}{totalPnLPercent}%)
          </h5>
          <p>P&L</p>
        </div>
      </div>

      {allHoldings.length > 0 && <VerticalGraph data={graphData} />}
    </>
  );
};

export default Holdings;
