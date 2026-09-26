require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");
const { UserModel } = require("./model/UserModel");
const { analyzeStock, chatCopilot } = require("./services/groqService");

const app = express();

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/stock-trading";
const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret_key_12345";

let isMongoConnected = false;

// High-speed In-Memory DB fallback for zero-setup local running
const memoryStore = {
  users: [
    {
      _id: "demo-user-id-01",
      username: "Trader",
      email: "trader@zerodha.com",
      password: "",
      funds: { available: 100000, used: 0 },
    },
  ],
  holdings: [
    { _id: "h1", name: "BHARTIARTL", qty: 2, avg: 538.05, price: 541.15, net: "+0.58%", day: "+2.99%" },
    { _id: "h2", name: "HDFCBANK", qty: 2, avg: 1383.4, price: 1522.35, net: "+10.04%", day: "+0.11%" },
    { _id: "h3", name: "HINDUNILVR", qty: 1, avg: 2335.85, price: 2417.4, net: "+3.49%", day: "+0.21%" },
    { _id: "h4", name: "INFY", qty: 1, avg: 1350.5, price: 1555.45, net: "+15.18%", day: "-1.60%", isLoss: true },
    { _id: "h5", name: "ITC", qty: 5, avg: 202.0, price: 207.9, net: "+2.92%", day: "+0.80%" },
    { _id: "h6", name: "KPITTECH", qty: 5, avg: 250.3, price: 266.45, net: "+6.45%", day: "+3.54%" },
    { _id: "h7", name: "RELIANCE", qty: 1, avg: 2193.7, price: 2112.4, net: "-3.71%", day: "+1.44%" },
    { _id: "h8", name: "SBIN", qty: 4, avg: 324.35, price: 430.2, net: "+32.63%", day: "-0.34%", isLoss: true },
    { _id: "h9", name: "TATAPOWER", qty: 5, avg: 104.2, price: 124.15, net: "+19.15%", day: "-0.24%", isLoss: true },
    { _id: "h10", name: "TCS", qty: 1, avg: 3041.7, price: 3194.8, net: "+5.03%", day: "-0.25%", isLoss: true },
    { _id: "h11", name: "WIPRO", qty: 4, avg: 489.3, price: 577.75, net: "+18.08%", day: "+0.32%" },
  ],
  positions: [
    { product: "CNC", name: "EVEREADY", qty: 2, avg: 316.27, price: 312.35, net: "+0.58%", day: "-1.24%", isLoss: true },
    { product: "CNC", name: "JUBLFOOD", qty: 1, avg: 3124.75, price: 3082.65, net: "+10.04%", day: "-1.35%", isLoss: true },
  ],
  orders: [],
};

// Hash the demo user password on startup (for consistency)
const demoUser = memoryStore.users.find(u => u.email === "trader@zerodha.com");
if (demoUser && !demoUser.password.startsWith("$2a$")) {
  bcrypt.hash("demo123", 10).then(hashed => { demoUser.password = hashed; });
}

// Authentication & Identity Middleware
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    let userId = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        userId = decoded.userId;
        req.user = decoded;
      } catch (err) {
        // Invalid/expired token
      }
    }

    if (!userId) {
      userId = req.headers["x-user-id"] || req.body.userId || req.query.userId;
    }

    req.userId = userId;
    next();
  } catch (error) {
    next();
  }
};

app.use(authMiddleware);

// Health check
app.get("/", (req, res) => {
  res.json({
    status: "online",
    database: isMongoConnected ? "MongoDB Atlas / Local" : "In-Memory Fallback Engine",
    message: "Stock Trading API with Groq AI is running smoothly!",
    timestamp: new Date().toISOString(),
  });
});

// Seed Initial Positions
app.get("/addPositions", async (req, res) => {
  try {
    let tempPositions = [
      { product: "CNC", name: "EVEREADY", qty: 2, avg: 316.27, price: 312.35, net: "+0.58%", day: "-1.24%", isLoss: true },
      { product: "CNC", name: "JUBLFOOD", qty: 1, avg: 3124.75, price: 3082.65, net: "+10.04%", day: "-1.35%", isLoss: true },
    ];

    if (isMongoConnected) {
      await PositionsModel.deleteMany({});
      await PositionsModel.insertMany(tempPositions);
    } else {
      memoryStore.positions = [...tempPositions];
    }

    res.json({ success: true, message: "Positions seeded successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Holdings API
app.get("/allHoldings", async (req, res) => {
  try {
    if (isMongoConnected) {
      let query = {};
      if (req.userId) {
        query = { $or: [{ userId: req.userId }, { userId: null }, { userId: { $exists: false } }] };
      }
      const allHoldings = await HoldingsModel.find(query);
      return res.json(allHoldings);
    } else {
      return res.json(memoryStore.holdings);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Positions API
app.get("/allPositions", async (req, res) => {
  try {
    if (isMongoConnected) {
      const allPositions = await PositionsModel.find({});
      return res.json(allPositions);
    } else {
      return res.json(memoryStore.positions);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Orders API
app.get("/allOrders", async (req, res) => {
  try {
    if (isMongoConnected) {
      let query = {};
      if (req.userId) {
        query = { $or: [{ userId: req.userId }, { userId: null }, { userId: { $exists: false } }] };
      }
      const allOrders = await OrdersModel.find(query).sort({ createdAt: -1 });
      return res.json(allOrders);
    } else {
      return res.json([...memoryStore.orders].reverse());
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Funds API
app.get("/funds", async (req, res) => {
  try {
    let funds = { available: 100000, used: 0, total: 100000 };
    if (isMongoConnected) {
      if (req.userId) {
        const user = await UserModel.findById(req.userId);
        if (user && user.funds) {
          funds = {
            available: user.funds.available ?? 100000,
            used: user.funds.used ?? 0,
            total: (user.funds.available ?? 100000) + (user.funds.used ?? 0),
          };
        }
      }
    } else {
      const user = memoryStore.users.find((u) => u._id === req.userId) || memoryStore.users[0];
      if (user && user.funds) {
        funds = {
          available: user.funds.available,
          used: user.funds.used,
          total: user.funds.available + user.funds.used,
        };
      }
    }
    res.json(funds);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add Funds (Virtual deposit)
app.post("/funds/add", async (req, res) => {
  try {
    const amount = Number(req.body.amount) || 25000;
    let newAvailable = 100000 + amount;

    if (isMongoConnected) {
      if (req.userId) {
        const user = await UserModel.findById(req.userId);
        if (user) {
          if (!user.funds) user.funds = { available: 100000, used: 0 };
          user.funds.available = (user.funds.available || 0) + amount;
          await user.save();
          newAvailable = user.funds.available;
        }
      }
    } else {
      const user = memoryStore.users.find((u) => u._id === req.userId) || memoryStore.users[0];
      user.funds.available += amount;
      newAvailable = user.funds.available;
    }

    res.json({
      success: true,
      message: `₹${amount.toLocaleString("en-IN")} added successfully to your trading margin!`,
      available: newAvailable,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Dynamic Portfolio Summary API
app.get("/summary", async (req, res) => {
  try {
    let holdings = [];
    let availableMargin = 100000;
    let usedMargin = 0;

    if (isMongoConnected) {
      let query = {};
      if (req.userId) {
        query = { $or: [{ userId: req.userId }, { userId: null }, { userId: { $exists: false } }] };
      }
      holdings = await HoldingsModel.find(query);
      if (req.userId) {
        const user = await UserModel.findById(req.userId);
        if (user && user.funds) {
          availableMargin = user.funds.available ?? 100000;
          usedMargin = user.funds.used ?? 0;
        }
      }
    } else {
      holdings = memoryStore.holdings;
      const user = memoryStore.users.find((u) => u._id === req.userId) || memoryStore.users[0];
      if (user && user.funds) {
        availableMargin = user.funds.available;
        usedMargin = user.funds.used;
      }
    }

    let totalInvestment = 0;
    let currentValue = 0;

    holdings.forEach((stock) => {
      const investment = (stock.avg || 0) * (stock.qty || 0);
      const cur = (stock.price || 0) * (stock.qty || 0);
      totalInvestment += investment;
      currentValue += cur;
    });

    const totalPnL = currentValue - totalInvestment;
    const pnlPercent = totalInvestment > 0 ? (totalPnL / totalInvestment) * 100 : 0;

    res.json({
      totalInvestment: Number(totalInvestment.toFixed(2)),
      currentValue: Number(currentValue.toFixed(2)),
      totalPnL: Number(totalPnL.toFixed(2)),
      pnlPercent: Number(pnlPercent.toFixed(2)),
      isProfit: totalPnL >= 0,
      holdingsCount: holdings.length,
      availableMargin: Number(availableMargin.toFixed(2)),
      usedMargin: Number(usedMargin.toFixed(2)),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Core Trading Engine - Order Execution (BUY & SELL)
app.post("/newOrder", async (req, res) => {
  try {
    const { name, mode } = req.body;
    const qty = Number(req.body.qty);
    const price = Number(req.body.price);
    const orderType = req.body.orderType || "MARKET";
    const userId = req.userId || req.body.userId;

    if (!name || !qty || qty <= 0 || !price || price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order details. Stock name, positive quantity and price are required.",
      });
    }

    const orderMode = String(mode).toUpperCase();
    if (orderMode !== "BUY" && orderMode !== "SELL") {
      return res.status(400).json({
        success: false,
        message: "Order mode must be either BUY or SELL.",
      });
    }

    const totalAmount = qty * price;

    if (isMongoConnected) {
      let user = null;
      if (userId) {
        user = await UserModel.findById(userId);
      }

      if (orderMode === "BUY") {
        if (user && user.funds) {
          if (user.funds.available < totalAmount) {
            return res.status(400).json({
              success: false,
              message: `Insufficient margin! Required: ₹${totalAmount.toFixed(2)}, Available: ₹${user.funds.available.toFixed(2)}`,
            });
          }
          user.funds.available -= totalAmount;
          user.funds.used = (user.funds.used || 0) + totalAmount;
          await user.save();
        }

        const holdingQuery = userId ? { name, userId } : { name };
        let existingHolding = await HoldingsModel.findOne(holdingQuery);

        if (existingHolding) {
          const totalOldCost = existingHolding.qty * existingHolding.avg;
          const totalNewCost = totalOldCost + totalAmount;
          const newTotalQty = existingHolding.qty + qty;
          const newAvg = totalNewCost / newTotalQty;

          existingHolding.qty = newTotalQty;
          existingHolding.avg = Number(newAvg.toFixed(2));
          existingHolding.price = price;
          existingHolding.updatedAt = new Date();
          await existingHolding.save();
        } else {
          const newHolding = new HoldingsModel({
            userId: userId || null,
            name,
            qty,
            avg: price,
            price,
            net: "+0.00%",
            day: "+0.00%",
            isLoss: false,
          });
          await newHolding.save();
        }
      }

      if (orderMode === "SELL") {
        const holdingQuery = userId ? { name, userId } : { name };
        const existingHolding = await HoldingsModel.findOne(holdingQuery);

        if (!existingHolding || existingHolding.qty < qty) {
          return res.status(400).json({
            success: false,
            message: `Cannot sell! You hold ${existingHolding ? existingHolding.qty : 0} shares of ${name}, but tried to sell ${qty}.`,
          });
        }

        if (user && user.funds) {
          user.funds.available += totalAmount;
          if (user.funds.used >= totalAmount) {
            user.funds.used -= totalAmount;
          }
          await user.save();
        }

        if (existingHolding.qty === qty) {
          await HoldingsModel.findByIdAndDelete(existingHolding._id);
        } else {
          existingHolding.qty -= qty;
          existingHolding.price = price;
          existingHolding.updatedAt = new Date();
          await existingHolding.save();
        }
      }

      const newOrder = new OrdersModel({
        userId: userId || null,
        name,
        qty,
        price,
        mode: orderMode,
        orderType,
        status: "EXECUTED",
        createdAt: new Date(),
      });
      await newOrder.save();

      return res.json({
        success: true,
        message: `${orderMode} order executed successfully for ${qty} shares of ${name} at ₹${price.toFixed(2)}!`,
        order: newOrder,
        funds: user ? user.funds : null,
      });
    } else {
      // In-Memory Execution
      const user = memoryStore.users.find((u) => u._id === userId) || memoryStore.users[0];

      if (orderMode === "BUY") {
        if (user.funds.available < totalAmount) {
          return res.status(400).json({
            success: false,
            message: `Insufficient margin! Required: ₹${totalAmount.toFixed(2)}, Available: ₹${user.funds.available.toFixed(2)}`,
          });
        }
        user.funds.available -= totalAmount;
        user.funds.used += totalAmount;

        let existingHolding = memoryStore.holdings.find((h) => h.name === name);
        if (existingHolding) {
          const totalOldCost = existingHolding.qty * existingHolding.avg;
          const totalNewCost = totalOldCost + totalAmount;
          const newTotalQty = existingHolding.qty + qty;
          const newAvg = totalNewCost / newTotalQty;

          existingHolding.qty = newTotalQty;
          existingHolding.avg = Number(newAvg.toFixed(2));
          existingHolding.price = price;
        } else {
          memoryStore.holdings.push({
            _id: "h_" + Date.now(),
            name,
            qty,
            avg: price,
            price,
            net: "+0.00%",
            day: "+0.00%",
            isLoss: false,
          });
        }
      }

      if (orderMode === "SELL") {
        const existingIndex = memoryStore.holdings.findIndex((h) => h.name === name);
        if (existingIndex === -1 || memoryStore.holdings[existingIndex].qty < qty) {
          const held = existingIndex === -1 ? 0 : memoryStore.holdings[existingIndex].qty;
          return res.status(400).json({
            success: false,
            message: `Cannot sell! You hold ${held} shares of ${name}, but tried to sell ${qty}.`,
          });
        }

        user.funds.available += totalAmount;
        if (user.funds.used >= totalAmount) {
          user.funds.used -= totalAmount;
        }

        if (memoryStore.holdings[existingIndex].qty === qty) {
          memoryStore.holdings.splice(existingIndex, 1);
        } else {
          memoryStore.holdings[existingIndex].qty -= qty;
          memoryStore.holdings[existingIndex].price = price;
        }
      }

      const orderObj = {
        _id: "ord_" + Date.now(),
        name,
        qty,
        price,
        mode: orderMode,
        orderType,
        status: "EXECUTED",
        createdAt: new Date(),
      };
      memoryStore.orders.push(orderObj);

      return res.json({
        success: true,
        message: `${orderMode} order executed successfully for ${qty} shares of ${name} at ₹${price.toFixed(2)}!`,
        order: orderObj,
        funds: user.funds,
      });
    }
  } catch (err) {
    console.error("Order execution error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Authentication: Signup
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (isMongoConnected) {
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, message: "Email already registered" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        funds: { available: 100000, used: 0 },
      });
      await newUser.save();

      const token = jwt.sign(
        { userId: newUser._id, email: newUser.email, username: newUser.username },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({
        success: true,
        message: "User registered successfully",
        token,
        userId: newUser._id,
        username: newUser.username,
        funds: newUser.funds,
      });
    } else {
      // In-Memory Signup
      const existingUser = memoryStore.users.find((u) => u.email === email);
      if (existingUser) {
        return res.status(400).json({ success: false, message: "Email already registered" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        _id: "usr_" + Date.now(),
        username,
        email,
        password: hashedPassword,
        funds: { available: 100000, used: 0 },
      };
      memoryStore.users.push(newUser);

      const token = jwt.sign(
        { userId: newUser._id, email: newUser.email, username: newUser.username },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({
        success: true,
        message: "User registered successfully (In-Memory)",
        token,
        userId: newUser._id,
        username: newUser.username,
        funds: newUser.funds,
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Authentication: Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (isMongoConnected) {
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(400).json({ success: false, message: "User not found" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { userId: user._id, email: user.email, username: user.username },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({
        success: true,
        message: "Login Successful",
        token,
        userId: user._id,
        username: user.username,
        funds: user.funds || { available: 100000, used: 0 },
      });
    } else {
      // In-Memory Login
      let user = memoryStore.users.find((u) => u.email === email);
      if (!user || !user.password) {
        return res.status(400).json({ success: false, message: "User not found. Please signup first." });
      }

      try {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ success: false, message: "Invalid credentials" });
        }
      } catch (err) {
        return res.status(400).json({ success: false, message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { userId: user._id, email: user.email, username: user.username },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({
        success: true,
        message: "Login Successful",
        token,
        userId: user._id,
        username: user.username,
        funds: user.funds,
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// GROQ AI INTEGRATION ENDPOINTS
// ==========================================

// AI Stock Technical & Sentiment Analysis (Groq Llama 3.3)
app.post("/api/ai/analyze", async (req, res) => {
  try {
    const { name, price, percent, holdings } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Stock name is required" });
    }

    const analysis = await analyzeStock({
      name,
      price: price || 1000,
      percent: percent || "0.00%",
      holdings,
    });

    res.json(analysis);
  } catch (err) {
    console.error("AI Analysis error:", err);
    res.status(500).json({ error: "Failed to generate AI analysis", details: err.message });
  }
});

// Kite Copilot - AI Trading Assistant (Groq Llama 3.3)
app.post("/api/ai/copilot", async (req, res) => {
  try {
    const { message, chatHistory, stockContext } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await chatCopilot({
      message,
      chatHistory: chatHistory || [],
      stockContext,
    });

    res.json(response);
  } catch (err) {
    console.error("AI Copilot error:", err);
    res.status(500).json({ error: "Copilot error", details: err.message });
  }
});

// Server Launch with resilient MongoDB connection attempt
const startServer = () => {
  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 Zerodha Kite Backend Server running on port ${PORT}`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`💾 Database: ${isMongoConnected ? "MongoDB Connected" : "In-Memory Store (Instant Zero-Config Mode)"}`);
    console.log(`⚡ Groq AI: ${process.env.GROQ_API_KEY ? "Connected (Llama 3.3 70B)" : "Fallback Simulation (Set GROQ_API_KEY in .env)"}`);
    console.log(`======================================================\n`);
  });
};

mongoose
  .connect(uri, { serverSelectionTimeoutMS: 3000 })
  .then(() => {
    isMongoConnected = true;
    console.log("✓ MongoDB Connected Successfully");
    startServer();
  })
  .catch((err) => {
    isMongoConnected = false;
    console.warn("⚠️  MongoDB not found on " + uri + " (" + err.message + ")");
    console.log("✓ Falling back to In-Memory Engine for seamless zero-config local testing.");
    startServer();
  });