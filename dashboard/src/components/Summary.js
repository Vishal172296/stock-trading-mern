import React, { useState, useEffect, useContext } from "react";
import api from "../api";
import GeneralContext from "./GeneralContext";

const Summary = () => {
  const [summaryData, setSummaryData] = useState({
    totalInvestment: 0,
    currentValue: 0,
    totalPnL: 0,
    pnlPercent: 0,
    isProfit: true,
    holdingsCount: 0,
    availableMargin: 100000,
    usedMargin: 0,
  });

  const { portfolioVersion } = useContext(GeneralContext);
  const username = localStorage.getItem("username") || "Trader";

  useEffect(() => {
    let isMounted = true;
    const fetchSummary = async () => {
      try {
        const res = await api.get("/summary");
        if (isMounted) {
          setSummaryData(res.data);
        }
      } catch (err) {
        console.error("Error fetching summary:", err);
      }
    };

    fetchSummary();
    return () => {
      isMounted = false;
    };
  }, [portfolioVersion]);

  const formatCurrency = (val) => {
    return Number(val || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <>
      <div className="username">
        <h6> Hi, {username}!</h6>
        <hr className="divider" />
      </div>

      {/* Equity & Funds Section */}
      <div className="section">
        <span>
          <p>Equity</p>
        </span>

        <div className="data">
          <div className="first">
            <h3>₹{formatCurrency(summaryData.availableMargin)}</h3>
            <p>Margin available</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Margins used <span>₹{formatCurrency(summaryData.usedMargin)}</span>
            </p>
            <p>
              Total Capital{" "}
              <span>
                ₹{formatCurrency(summaryData.availableMargin + summaryData.usedMargin)}
              </span>
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>

      {/* Holdings & PnL Section */}
      <div className="section">
        <span>
          <p>Holdings ({summaryData.holdingsCount})</p>
        </span>

        <div className="data">
          <div className="first">
            <h3 className={summaryData.isProfit ? "profit" : "loss"}>
              {summaryData.isProfit ? "+" : ""}
              ₹{formatCurrency(summaryData.totalPnL)}{" "}
              <small>
                {summaryData.isProfit ? "+" : ""}
                {summaryData.pnlPercent}%
              </small>
            </h3>
            <p>P&L</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Current Value <span>₹{formatCurrency(summaryData.currentValue)}</span>
            </p>
            <p>
              Investment <span>₹{formatCurrency(summaryData.totalInvestment)}</span>
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>

      {/* Quick Tips / Market Status Banner */}
      <div
        style={{
          marginTop: "20px",
          padding: "16px",
          background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)",
          borderRadius: "6px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <strong style={{ color: "#333" }}>⚡ Groq AI Market Intelligence Active</strong>
          <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "#666" }}>
            Click the sparkle (✨) icon or chart on any stock in your watchlist to get real-time Llama 3.3 technical & sentiment insights.
          </p>
        </div>
        <div style={{ fontSize: "0.85rem", color: "#2e7d32", fontWeight: 600 }}>
          ● Market Open
        </div>
      </div>
    </>
  );
};

export default Summary;
