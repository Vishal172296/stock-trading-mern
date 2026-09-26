import React, { useState, useEffect, useContext } from "react";
import api from "../api";
import GeneralContext from "./GeneralContext";

const AiInsightsModal = ({ stock, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const generalContext = useContext(GeneralContext);

  const stockName = typeof stock === "object" ? stock.name : stock;
  const stockPrice = typeof stock === "object" ? stock.price : 1000;
  const stockPercent = typeof stock === "object" ? stock.percent : "0.00%";

  useEffect(() => {
    let isMounted = true;
    const fetchAiInsights = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.post("/api/ai/analyze", {
          name: stockName,
          price: stockPrice,
          percent: stockPercent,
        });
        if (isMounted) {
          setData(res.data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.error || err.message || "Failed to load AI insights");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAiInsights();
    return () => {
      isMounted = false;
    };
  }, [stockName, stockPrice, stockPercent]);

  const getSentimentColor = (sentiment) => {
    if (sentiment === "Bullish") return "#2e7d32";
    if (sentiment === "Bearish") return "#d32f2f";
    return "#f57c00";
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.55)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(3px)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "90%",
          maxWidth: "620px",
          maxHeight: "88vh",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
          overflowY: "auto",
          padding: "24px",
          position: "relative",
          animation: "fadeIn 0.2s ease-in-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            borderBottom: "1px solid #eee",
            paddingBottom: "14px",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <h2 style={{ margin: 0, fontSize: "1.4rem", color: "#222" }}>{stockName}</h2>
              <span
                style={{
                  background: "linear-gradient(135deg, #f5576c 0%, #f093fb 100%)",
                  color: "#fff",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  padding: "3px 8px",
                  borderRadius: "12px",
                  letterSpacing: "0.5px",
                }}
              >
                ⚡ GROQ AI
              </span>
            </div>
            <div style={{ marginTop: "4px", fontSize: "0.9rem", color: "#555" }}>
              ₹{stockPrice} <span style={{ color: String(stockPercent).includes("-") ? "#d32f2f" : "#2e7d32", fontWeight: 600 }}>({stockPercent})</span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#f0f0f0",
              border: "none",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              fontSize: "1rem",
              cursor: "pointer",
              color: "#555",
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <div
              style={{
                display: "inline-block",
                width: "40px",
                height: "40px",
                border: "3px solid #f3f3f3",
                borderTop: "3px solid #ff5722",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
            <p style={{ marginTop: "14px", color: "#666", fontSize: "0.95rem" }}>
              Groq Llama 3.3 is analyzing market volume, technical pivots, and sentiment...
            </p>
          </div>
        ) : error ? (
          <div style={{ padding: "20px", color: "#d32f2f", background: "#ffebee", borderRadius: "6px", margin: "20px 0" }}>
            <strong>Error:</strong> {error}
          </div>
        ) : (
          <div style={{ marginTop: "16px" }}>
            {/* Top Signal Badges */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "12px",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  background: "#f8f9fa",
                  padding: "12px",
                  borderRadius: "6px",
                  textAlign: "center",
                  borderLeft: `4px solid ${getSentimentColor(data?.sentiment)}`,
                }}
              >
                <div style={{ fontSize: "0.75rem", color: "#777" }}>AI Sentiment</div>
                <div
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color: getSentimentColor(data?.sentiment),
                    marginTop: "2px",
                  }}
                >
                  {data?.sentiment}
                </div>
              </div>

              <div
                style={{
                  background: "#f8f9fa",
                  padding: "12px",
                  borderRadius: "6px",
                  textAlign: "center",
                  borderLeft: "4px solid #2962ff",
                }}
              >
                <div style={{ fontSize: "0.75rem", color: "#777" }}>Recommendation</div>
                <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "#2962ff", marginTop: "2px" }}>
                  {data?.recommendation || "HOLD"}
                </div>
              </div>

              <div
                style={{
                  background: "#f8f9fa",
                  padding: "12px",
                  borderRadius: "6px",
                  textAlign: "center",
                  borderLeft: "4px solid #00897b",
                }}
              >
                <div style={{ fontSize: "0.75rem", color: "#777" }}>Confidence</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#00897b", marginTop: "2px" }}>
                  {data?.confidence || 80}%
                </div>
              </div>
            </div>

            {/* AI Summary */}
            <div
              style={{
                background: "#f3f7fe",
                borderLeft: "4px solid #4184f3",
                padding: "14px 16px",
                borderRadius: "4px",
                marginBottom: "16px",
                fontSize: "0.92rem",
                lineHeight: "1.5",
                color: "#2c3e50",
              }}
            >
              <strong>Executive Summary:</strong> {data?.summary}
            </div>

            {/* Technical Levels Table */}
            <div style={{ marginBottom: "16px" }}>
              <h4 style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "#444" }}>Key Technical Levels</h4>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "10px",
                  textAlign: "center",
                }}
              >
                <div style={{ background: "#e8f5e9", padding: "10px", borderRadius: "4px" }}>
                  <div style={{ fontSize: "0.75rem", color: "#2e7d32" }}>Support Level</div>
                  <div style={{ fontSize: "1rem", fontWeight: 700, color: "#1b5e20" }}>
                    ₹{data?.technicalLevels?.support || (stockPrice * 0.96).toFixed(2)}
                  </div>
                </div>
                <div style={{ background: "#ffebee", padding: "10px", borderRadius: "4px" }}>
                  <div style={{ fontSize: "0.75rem", color: "#c62828" }}>Resistance</div>
                  <div style={{ fontSize: "1rem", fontWeight: 700, color: "#b71c1c" }}>
                    ₹{data?.technicalLevels?.resistance || (stockPrice * 1.05).toFixed(2)}
                  </div>
                </div>
                <div style={{ background: "#fff8e1", padding: "10px", borderRadius: "4px" }}>
                  <div style={{ fontSize: "0.75rem", color: "#f57f17" }}>Suggested Stop-Loss</div>
                  <div style={{ fontSize: "1rem", fontWeight: 700, color: "#e65100" }}>
                    ₹{data?.technicalLevels?.stopLoss || (stockPrice * 0.94).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Key Drivers */}
            {data?.keyDrivers && data.keyDrivers.length > 0 && (
              <div style={{ marginBottom: "16px" }}>
                <h4 style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "#444" }}>Key Drivers & Catalyst</h4>
                <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "0.88rem", color: "#555", lineHeight: "1.6" }}>
                  {data.keyDrivers.map((driver, idx) => (
                    <li key={idx}>{driver}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quick Actions */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "20px",
                paddingTop: "14px",
                borderTop: "1px solid #eee",
              }}
            >
              <div style={{ fontSize: "0.75rem", color: "#888" }}>
                Powered by <strong>{data?.poweredBy || "Groq Llama 3.3"}</strong>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  style={{
                    backgroundColor: "#4184f3",
                    color: "#fff",
                    border: "none",
                    padding: "8px 18px",
                    borderRadius: "4px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    onClose();
                    generalContext.openBuyWindow(stock);
                  }}
                >
                  Buy {stockName}
                </button>
                <button
                  style={{
                    backgroundColor: "#ff5722",
                    color: "#fff",
                    border: "none",
                    padding: "8px 18px",
                    borderRadius: "4px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    onClose();
                    generalContext.openSellWindow(stock);
                  }}
                >
                  Sell {stockName}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiInsightsModal;
