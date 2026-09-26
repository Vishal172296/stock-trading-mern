import React, { useEffect, useState, useContext } from "react";
import api from "../api";
import GeneralContext from "./GeneralContext";

const Orders = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const { portfolioVersion } = useContext(GeneralContext);

  useEffect(() => {
    let isMounted = true;
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await api.get("/allOrders");
        if (isMounted) {
          setAllOrders(res.data);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchOrders();
    return () => {
      isMounted = false;
    };
  }, [portfolioVersion]);

  return (
    <div className="orders">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <h3 style={{ margin: 0 }}>Orders ({allOrders.length})</h3>
        <span style={{ fontSize: "0.85rem", color: "#666" }}>
          Live order book • Real-time execution
        </span>
      </div>

      <table>
        <thead>
          <tr>
            <th>Time</th>
            <th>Type</th>
            <th>Instrument</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total Value</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {allOrders.map((order, index) => {
            const isBuy = String(order.mode).toUpperCase() === "BUY";
            const dateStr = order.createdAt
              ? new Date(order.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })
              : "Just now";

            const totalValue = (Number(order.qty) * Number(order.price)).toFixed(2);

            return (
              <tr key={order._id || index}>
                <td style={{ fontSize: "0.85rem", color: "#666" }}>{dateStr}</td>
                <td>
                  <span
                    style={{
                      backgroundColor: isBuy ? "#e3f2fd" : "#fbe9e7",
                      color: isBuy ? "#1565c0" : "#d84315",
                      padding: "3px 8px",
                      borderRadius: "4px",
                      fontWeight: 700,
                      fontSize: "0.75rem",
                    }}
                  >
                    {order.mode || (isBuy ? "BUY" : "SELL")}
                  </span>
                </td>
                <td>
                  <strong>{order.name}</strong>
                </td>
                <td>{order.qty}</td>
                <td>₹{Number(order.price).toFixed(2)}</td>
                <td>₹{Number(totalValue).toLocaleString("en-IN")}</td>
                <td>
                  <span
                    style={{
                      backgroundColor: "#e8f5e9",
                      color: "#2e7d32",
                      padding: "2px 6px",
                      borderRadius: "3px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                    }}
                  >
                    {order.status || "COMPLETE"}
                  </span>
                </td>
              </tr>
            );
          })}

          {allOrders.length === 0 && !loading && (
            <tr>
              <td colSpan="7" style={{ textAlign: "center", padding: "40px", color: "#888" }}>
                No executed orders yet. Place a trade from the Watchlist to see your order history here!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;