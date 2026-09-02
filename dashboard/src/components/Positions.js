import React, { useState, useEffect } from "react";
import axios, { all } from "axios";
import { VerticalGraph } from "./VerticalGraph";

//import { positions } from "../data/data";

const Positions = () => {
  const [allPositions, setAllPositions] = useState([]);

  useEffect(() => {
    axios.get("http://stock-trading-backend-s0su.onrender.com/allPositions").then((res) => {
       //console.log(res.data);
      setAllPositions(res.data);
    });
  }, []);

  // const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  const labels = allPositions.map((subArray) => subArray["name"]);

  const data = {
    labels,
    datasets: [
      {
        label: "Stock Price",
        data: allPositions.map((stock) => stock.price),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };
  return (
    <>
      <h3 className="title">Positions ({allPositions.length})</h3>

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
      const curValue = stock.price * stock.qty;
      const isProfit = curValue - stock.avg * stock.qty >= 0;

      return (
        <tr key={index}>
          <td>{stock.product}</td>
          <td>{stock.name}</td>
          <td>{stock.qty}</td>
          <td>{stock.avg.toFixed(2)}</td>
          <td>{stock.price.toFixed(2)}</td>
          <td className={isProfit ? "profit" : "loss"}>
            {(curValue - stock.avg * stock.qty).toFixed(2)}
          </td>
          <td className={stock.isLoss ? "loss" : "profit"}>
            {stock.net}
          </td>
        </tr>
      );
    })}
  </tbody>
</table>
      </div>
    </>
  );
};

export default Positions;
