import React, { useEffect, useState } from "react";
import axios from "axios";

const Orders = () => {

  const [allOrders, setAllOrders] = useState([]);

  useEffect(() => {
    axios.get("https://stock-trading-backend-s0su.onrender.com/allOrders")
      .then((res) => {
        setAllOrders(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="orders">

      <h3>Orders ({allOrders.length})</h3>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Mode</th>
          </tr>
        </thead>

        <tbody>
          {allOrders.map((order, index) => (
            <tr key={index}>
              <td>{order.name}</td>
              <td>{order.qty}</td>
              <td>{order.price}</td>
              <td>{order.mode}</td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
};

export default Orders;