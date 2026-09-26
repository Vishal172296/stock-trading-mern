import React, { useState, useEffect } from "react";
import Menu from "./Menu";

const TopBar = () => {
  const [nifty, setNifty] = useState({ points: 25145.2, change: "+112.40", percent: "+0.45%" });
  const [sensex, setSensex] = useState({ points: 82388.9, change: "+345.60", percent: "+0.42%" });

  // Minor realistic index tick animation
  useEffect(() => {
    const interval = setInterval(() => {
      const deltaNifty = (Math.random() * 4 - 1.8).toFixed(2);
      const deltaSensex = (Math.random() * 12 - 5.5).toFixed(2);

      setNifty((prev) => ({
        ...prev,
        points: Number((prev.points + Number(deltaNifty)).toFixed(2)),
      }));

      setSensex((prev) => ({
        ...prev,
        points: Number((prev.points + Number(deltaSensex)).toFixed(2)),
      }));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="topbar-container">
      <div className="indices-container">
        <div className="nifty">
          <p className="index">NIFTY 50</p>
          <p className="index-points">{nifty.points.toLocaleString("en-IN")} </p>
          <p className="percent" style={{ color: "#2e7d32" }}>
            {nifty.percent}
          </p>
        </div>
        <div className="sensex">
          <p className="index">SENSEX</p>
          <p className="index-points">{sensex.points.toLocaleString("en-IN")}</p>
          <p className="percent" style={{ color: "#2e7d32" }}>
            {sensex.percent}
          </p>
        </div>
      </div>

      <Menu />
    </div>
  );
};

export default TopBar;
