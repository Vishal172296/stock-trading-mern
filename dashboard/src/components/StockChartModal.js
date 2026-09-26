import React, { useState, useContext } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import GeneralContext from "./GeneralContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const StockChartModal = ({ stock, onClose }) => {
  const [timeframe, setTimeframe] = useState("1D");
  const generalContext = useContext(GeneralContext);

  const stockName = typeof stock === "object" ? stock.name : stock;
  const currentPrice = typeof stock === "object" ? Number(stock.price) : 1000;
  const isLoss = typeof stock === "object" ? Boolean(stock.isDown) : false;

  // Generate synthetic realistic timeframe price history around currentPrice
  const generateChartData = (tf) => {
    let points = 24;
    let labels = [];
    let prices = [];
    let base = currentPrice;

    if (tf === "1D") {
      labels = ["09:15", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "15:30"];
      points = labels.length;
    } else if (tf === "1W") {
      labels = ["Mon", "Tue", "Wed", "Thu", "Fri"];
      points = labels.length;
    } else if (tf === "1M") {
      labels = ["Week 1", "Week 2", "Week 3", "Week 4"];
      points = labels.length;
    } else {
      labels = ["Q1", "Q2", "Q3", "Q4", "Current"];
      points = labels.length;
    }

    // Generate smooth series ending at currentPrice
    for (let i = 0; i < points - 1; i++) {
      const variation = (Math.random() - 0.48) * (base * 0.03);
      prices.push(Number((base - (points - 1 - i) * 2 + variation).toFixed(2)));
    }
    prices.push(currentPrice);

    return { labels, prices };
  };

  const { labels, prices } = generateChartData(timeframe);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const chartColor = isLoss ? "rgba(223, 81, 76, 1)" : "rgba(65, 132, 243, 1)";
  const gradientColor = isLoss ? "rgba(223, 81, 76, 0.12)" : "rgba(65, 132, 243, 0.12)";

  const chartData = {
    labels,
    datasets: [
      {
        label: `${stockName} Price (₹)`,
        data: prices,
        borderColor: chartColor,
        backgroundColor: gradientColor,
        fill: true,
        tension: 0.35,
        borderWidth: 2.5,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: chartColor,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: (context) => `Price: ₹${context.parsed.y.toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#888", font: { size: 11 } },
      },
      y: {
        grid: { color: "#f0f0f0" },
        ticks: {
          color: "#888",
          font: { size: 11 },
          callback: (val) => `₹${val}`,
        },
      },
    },
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(2px)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "90%",
          maxWidth: "750px",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
          padding: "24px",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #eee",
            paddingBottom: "14px",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <h2 style={{ margin: 0, fontSize: "1.3rem", color: "#333" }}>{stockName}</h2>
              <span style={{ fontSize: "0.75rem", background: "#f0f0f0", padding: "2px 6px", borderRadius: "3px" }}>
                NSE EQ
              </span>
            </div>
            <div style={{ marginTop: "4px" }}>
              <span style={{ fontSize: "1.2rem", fontWeight: 700, color: "#222" }}>
                ₹{currentPrice.toFixed(2)}
              </span>
              <span
                style={{
                  marginLeft: "10px",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: isLoss ? "#df514c" : "#4caf50",
                }}
              >
                {typeof stock === "object" ? stock.percent : "+0.00%"}
              </span>
            </div>
          </div>

          {/* Timeframe switchers */}
          <div style={{ display: "flex", gap: "6px" }}>
            {["1D", "1W", "1M", "1Y"].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                style={{
                  border: "none",
                  padding: "5px 12px",
                  borderRadius: "4px",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  backgroundColor: timeframe === tf ? "#4184f3" : "#f5f5f5",
                  color: timeframe === tf ? "#fff" : "#555",
                }}
              >
                {tf}
              </button>
            ))}
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                fontSize: "1.2rem",
                cursor: "pointer",
                marginLeft: "8px",
                color: "#666",
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div
          style={{
            display: "flex",
            gap: "24px",
            fontSize: "0.8rem",
            color: "#666",
            padding: "10px 0",
          }}
        >
          <div>Low: <strong style={{ color: "#333" }}>₹{minPrice.toFixed(2)}</strong></div>
          <div>High: <strong style={{ color: "#333" }}>₹{maxPrice.toFixed(2)}</strong></div>
          <div>Exchange: <strong style={{ color: "#333" }}>NSE</strong></div>
          <div>Tick Size: <strong style={{ color: "#333" }}>0.05</strong></div>
        </div>

        {/* Chart Canvas */}
        <div style={{ height: "300px", width: "100%", marginTop: "10px" }}>
          <Line data={chartData} options={options} />
        </div>

        {/* Action Footer */}
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
          <button
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "#fff",
              border: "none",
              padding: "8px 16px",
              borderRadius: "4px",
              fontWeight: 600,
              fontSize: "0.85rem",
              cursor: "pointer",
            }}
            onClick={() => {
              onClose();
              generalContext.openAiAnalysis(stock);
            }}
          >
            ⚡ Groq AI Insights
          </button>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              style={{
                backgroundColor: "#4184f3",
                color: "#fff",
                border: "none",
                padding: "8px 20px",
                borderRadius: "4px",
                fontWeight: 600,
                cursor: "pointer",
              }}
              onClick={() => {
                onClose();
                generalContext.openBuyWindow(stock);
              }}
            >
              BUY
            </button>
            <button
              style={{
                backgroundColor: "#ff5722",
                color: "#fff",
                border: "none",
                padding: "8px 20px",
                borderRadius: "4px",
                fontWeight: 600,
                cursor: "pointer",
              }}
              onClick={() => {
                onClose();
                generalContext.openSellWindow(stock);
              }}
            >
              SELL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockChartModal;
