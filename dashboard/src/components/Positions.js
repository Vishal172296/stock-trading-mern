import React, { useState, useEffect } from "react";
import api from "../api";

const Positions = () => {
  const [allPositions, setAllPositions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    api
      .get("/allPositions")
      .then((res) => {
        if (isMounted) setAllPositions(res.data);
      })
      .catch((err) => {
        console.error("Error fetching positions:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

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
          Positions ({allPositions.length})
        </h3>
        <span style={{ fontSize: "0.85rem", color: "#666" }}>
          Intraday & Derivatives open positions
        </span>
      </div>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg.</th>
              <th>LTP</th>
              <th>P&L</th>
              <th>Chg.</th>
            </tr>
          </thead>

          <tbody>
            {allPositions.map((stock, index) => {
              const curValue = (stock.price || 0) * (stock.qty || 0);
              const pnl = curValue - (stock.avg || 0) * (stock.qty || 0);
              const isProfit = pnl >= 0;

              return (
                <tr key={index}>
                  <td>
                    <span
                      style={{
                        backgroundColor: "#f5f5f5",
                        padding: "2px 6px",
                        borderRadius: "3px",
                        fontSize: "0.75rem",
                      }}
                    >
                      {stock.product || "CNC"}
                    </span>
                  </td>
                  <td>
                    <strong>{stock.name}</strong>
                  </td>
                  <td>{stock.qty}</td>
                  <td>₹{Number(stock.avg || 0).toFixed(2)}</td>
                  <td>₹{Number(stock.price || 0).toFixed(2)}</td>
                  <td className={isProfit ? "profit" : "loss"}>
                    {isProfit ? "+" : ""}₹{pnl.toFixed(2)}
                  </td>
                  <td className={stock.isLoss ? "loss" : "profit"}>
                    {stock.net || (isProfit ? "+0.00%" : "-0.00%")}
                  </td>
                </tr>
              );
            })}

            {allPositions.length === 0 && !loading && (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "40px", color: "#888" }}>
                  No open positions for the day.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Positions;
