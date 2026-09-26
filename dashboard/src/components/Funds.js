import React, { useState, useEffect, useContext } from "react";
import api from "../api";
import GeneralContext from "./GeneralContext";

const Funds = () => {
  const [funds, setFunds] = useState({ available: 100000, used: 0, total: 100000 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amountToAdd, setAmountToAdd] = useState(50000);
  const [loading, setLoading] = useState(false);

  const { portfolioVersion, triggerRefresh } = useContext(GeneralContext);

  useEffect(() => {
    let isMounted = true;
    api
      .get("/funds")
      .then((res) => {
        if (isMounted) setFunds(res.data);
      })
      .catch((err) => console.error("Error fetching funds:", err));

    return () => {
      isMounted = false;
    };
  }, [portfolioVersion]);

  const handleAddFunds = async () => {
    setLoading(true);
    try {
      const res = await api.post("/funds/add", { amount: Number(amountToAdd) });
      alert(res.data.message || `₹${amountToAdd} added successfully!`);
      setIsModalOpen(false);
      triggerRefresh();
    } catch (err) {
      alert("Error adding funds: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val) => {
    return Number(val || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <>
      <div className="funds">
        <p>Instant, zero-cost paper-trading fund transfer simulator </p>
        <button
          className="btn btn-green"
          style={{ border: "none", cursor: "pointer", marginRight: "8px" }}
          onClick={() => setIsModalOpen(true)}
        >
          + Add funds
        </button>
        <button
          className="btn btn-blue"
          style={{ border: "none", cursor: "pointer" }}
          onClick={() => alert("Withdrawal request recorded.")}
        >
          Withdraw
        </button>
      </div>

      <div className="row">
        <div className="col">
          <span>
            <p>Equity Segment</p>
          </span>

          <div className="table">
            <div className="data">
              <p>Available margin</p>
              <p className="imp colored">₹{formatCurrency(funds.available)}</p>
            </div>
            <div className="data">
              <p>Used margin</p>
              <p className="imp">₹{formatCurrency(funds.used)}</p>
            </div>
            <div className="data">
              <p>Available cash</p>
              <p className="imp">₹{formatCurrency(funds.available)}</p>
            </div>
            <hr />
            <div className="data">
              <p>Opening Balance</p>
              <p>₹{formatCurrency(funds.total)}</p>
            </div>
            <div className="data">
              <p>Delivery margin</p>
              <p>₹0.00</p>
            </div>
            <div className="data">
              <p>SPAN / Exposure</p>
              <p>₹0.00</p>
            </div>
            <div className="data">
              <p>Options premium</p>
              <p>₹0.00</p>
            </div>
            <hr />
            <div className="data">
              <p>Total Collateral</p>
              <p>₹{formatCurrency(funds.total)}</p>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="commodity">
            <p>You don't have a commodity account active</p>
            <button
              className="btn btn-blue"
              style={{ border: "none", cursor: "pointer" }}
              onClick={() => setIsModalOpen(true)}
            >
              Deposit Virtual Funds
            </button>
          </div>
        </div>
      </div>

      {/* Add Funds Modal */}
      {isModalOpen && (
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
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              padding: "24px",
              width: "90%",
              maxWidth: "400px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: "0 0 12px 0", color: "#333" }}>
              Add Demo Trading Funds
            </h3>
            <p style={{ fontSize: "0.85rem", color: "#666", marginBottom: "16px" }}>
              Add virtual funds to test paper trades and portfolio management.
            </p>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontSize: "0.8rem", color: "#444", display: "block", marginBottom: "6px" }}>
                Amount (₹)
              </label>
              <input
                type="number"
                value={amountToAdd}
                onChange={(e) => setAmountToAdd(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "1.1rem",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Quick preset chips */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
              {[25000, 50000, 100000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setAmountToAdd(amt)}
                  style={{
                    background: "#f0f4ff",
                    border: "1px solid #c7d8fe",
                    borderRadius: "4px",
                    padding: "6px 10px",
                    fontSize: "0.78rem",
                    color: "#2962ff",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  +₹{(amt / 1000).toFixed(0)}k
                </button>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                className="btn btn-grey"
                style={{ border: "none", cursor: "pointer", padding: "8px 14px" }}
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-green"
                style={{
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  padding: "8px 18px",
                  fontWeight: 600,
                }}
                onClick={handleAddFunds}
                disabled={loading}
              >
                {loading ? "Adding..." : "Confirm Deposit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Funds;
