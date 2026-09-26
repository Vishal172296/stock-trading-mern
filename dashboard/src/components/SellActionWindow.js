import React, { useState, useContext } from "react";
import api from "../api";
import GeneralContext from "./GeneralContext";
import "./BuyActionWindow.css";

const SellActionWindow = ({ uid }) => {
  const stockName = typeof uid === "object" ? uid?.name : uid;
  const initialPrice = typeof uid === "object" ? uid?.price || 100 : 100;

  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(initialPrice);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const generalContext = useContext(GeneralContext);

  const handleSellClick = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const response = await api.post("/newOrder", {
        name: stockName,
        qty: Number(stockQuantity),
        price: Number(stockPrice),
        mode: "SELL",
      });

      alert(response.data.message || `Sold ${stockQuantity} shares of ${stockName}!`);
      generalContext.closeSellWindow();
      generalContext.triggerRefresh();
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Sell Order Failed";
      setErrorMsg(message);
      alert("Error: " + message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = () => {
    generalContext.closeSellWindow();
  };

  return (
    <div
      className="container"
      id="sell-window"
      style={{
        borderTop: "4px solid #ff5722",
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
      }}
    >
      <div
        className="header"
        style={{
          background: "#ff5722",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h3 style={{ margin: 0 }}>
            SELL {stockName} <span style={{ opacity: 0.85 }}>x {stockQuantity} Qty</span>
          </h3>
          <span style={{ fontSize: "0.75rem", color: "#fff" }}>
            NSE • Market Execution
          </span>
        </div>
        <button
          onClick={handleCancelClick}
          style={{
            background: "none",
            border: "none",
            color: "#fff",
            fontSize: "1.2rem",
            cursor: "pointer",
          }}
        >
          ✕
        </button>
      </div>

      <div className="regular-order" style={{ padding: "16px 20px" }}>
        {errorMsg && (
          <div
            style={{
              padding: "8px 12px",
              background: "#ffebee",
              color: "#c62828",
              fontSize: "0.85rem",
              borderRadius: "4px",
              marginBottom: "12px",
            }}
          >
            {errorMsg}
          </div>
        )}

        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              min="1"
              onChange={(e) => setStockQuantity(e.target.value)}
              value={stockQuantity}
            />
          </fieldset>
          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              name="price"
              id="price"
              step="0.05"
              onChange={(e) => setStockPrice(e.target.value)}
              value={stockPrice}
            />
          </fieldset>
        </div>

        <div style={{ fontSize: "0.85rem", color: "#666", marginTop: "10px" }}>
          Estimated Proceeds:{" "}
          <strong style={{ color: "#388e3c" }}>
            ₹{(stockQuantity * stockPrice).toFixed(2)}
          </strong>
        </div>
      </div>

      <div
        className="buttons"
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "12px 20px",
          background: "#fafafa",
          borderTop: "1px solid #eee",
        }}
      >
        <span style={{ fontSize: "0.8rem", color: "#666" }}>
          Charges: ₹15.00 (STT & Brokerage)
        </span>
        <div>
          <button
            className="btn"
            style={{
              background: "#ff5722",
              color: "#fff",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              padding: "8px 18px",
              borderRadius: "3px",
              fontWeight: 600,
            }}
            onClick={handleSellClick}
            disabled={loading}
          >
            {loading ? "Selling..." : "Sell"}
          </button>
          <button
            className="btn btn-grey"
            style={{
              border: "none",
              cursor: "pointer",
              padding: "8px 14px",
              borderRadius: "3px",
              marginLeft: "6px",
            }}
            onClick={handleCancelClick}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellActionWindow;
