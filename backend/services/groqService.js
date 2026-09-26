const Groq = require("groq-sdk");

const getGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey.trim() === "" || apiKey.includes("your_groq_api_key")) {
    return null;
  }
  try {
    return new Groq({ apiKey: apiKey.trim() });
  } catch (err) {
    console.error("Error initializing Groq client:", err.message);
    return null;
  }
};

/**
 * Generate comprehensive AI analysis for a given stock using Groq Llama 3.3
 */
const analyzeStock = async ({ name, price, percent, holdings = null }) => {
  const client = getGroqClient();

  if (!client) {
    // High-quality offline simulated analysis when API key is not configured
    const isPositive = !String(percent).includes("-");
    const numPrice = Number(price) || 1000;
    const support = (numPrice * 0.96).toFixed(2);
    const resistance = (numPrice * 1.05).toFixed(2);
    const stopLoss = (numPrice * 0.94).toFixed(2);

    return {
      stock: name,
      sentiment: isPositive ? "Bullish" : "Bearish",
      confidence: isPositive ? 78 : 72,
      recommendation: isPositive ? "ACCUMULATE / BUY" : "HOLD / WATCH",
      summary: `${name} is currently trading around ₹${numPrice}. Price momentum shows ${
        isPositive ? "strong buyer accumulation with higher lows" : "mild profit-booking near resistance"
      }. Traders should track volume levels around key pivot points.`,
      technicalLevels: {
        currentPrice: numPrice,
        support: Number(support),
        resistance: Number(resistance),
        stopLoss: Number(stopLoss),
      },
      keyDrivers: [
        "Consistent institutional volume over the last trading sessions",
        "RSI indicates balanced momentum without being severely overbought",
        "Sector peers showing correlated price movements in current market cycle",
      ],
      riskLevel: "Medium",
      timeHorizon: "1-4 Weeks (Swing)",
      poweredBy: "Groq AI Heuristics (Add GROQ_API_KEY in backend/.env for live Llama-3.3 70B)",
    };
  }

  try {
    const prompt = `You are a SEBI-registered Senior Equity Research Analyst & Quantitative Strategist.
Analyze the following Indian stock:
- Stock Symbol: ${name}
- Current Price: ₹${price}
- Day Change: ${percent || "0.00%"}
${holdings ? `- User Current Holding: ${holdings.qty} shares @ avg ₹${holdings.avg}` : ""}

Provide a structured, institutional-grade technical & fundamental summary in strictly valid JSON format without markdown code blocks.
The JSON must follow this exact schema:
{
  "stock": "${name}",
  "sentiment": "Bullish" | "Bearish" | "Neutral",
  "confidence": number between 60 and 95,
  "recommendation": "BUY" | "SELL" | "HOLD" | "ACCUMULATE",
  "summary": "2-3 crisp sentences summarizing trend, momentum, and outlook",
  "technicalLevels": {
    "currentPrice": ${Number(price) || 1000},
    "support": number,
    "resistance": number,
    "stopLoss": number
  },
  "keyDrivers": [
    "Driver 1",
    "Driver 2",
    "Driver 3"
  ],
  "riskLevel": "Low" | "Medium" | "High",
  "timeHorizon": "Short Term (1-2 weeks)" | "Medium Term (1-3 months)",
  "poweredBy": "Groq Llama 3.3 70B"
}`;

    const completion = await client.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a professional financial analytics AI. Output ONLY raw valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(content);
    parsed.poweredBy = "Groq Llama-3.3-70B";
    return parsed;
  } catch (error) {
    console.error("Groq analyzeStock error:", error.message);
    // Fallback on API failure
    return {
      stock: name,
      sentiment: "Neutral",
      confidence: 70,
      recommendation: "HOLD",
      summary: `Analysis for ${name} at ₹${price}. Market consolidation observed near current levels.`,
      technicalLevels: {
        currentPrice: Number(price) || 1000,
        support: (Number(price) * 0.95).toFixed(2),
        resistance: (Number(price) * 1.05).toFixed(2),
        stopLoss: (Number(price) * 0.93).toFixed(2),
      },
      keyDrivers: ["Consolidation range", "Awaiting breakout catalyst"],
      riskLevel: "Medium",
      timeHorizon: "Short Term",
      poweredBy: "Groq AI (Fallback)",
      errorNote: error.message,
    };
  }
};

/**
 * Interactive Copilot chat powered by Groq
 */
const chatCopilot = async ({ message, chatHistory = [], stockContext = null }) => {
  const client = getGroqClient();

  if (!client) {
    return {
      reply: `Groq AI Copilot: To enable live conversational AI with Llama 3.3, please add your GROQ_API_KEY in 'backend/.env'.\n\nRegarding your question: "${message}" — As a general rule in trading, always define your Stop-Loss and risk no more than 1-2% of your capital per trade!`,
      poweredBy: "Groq AI (Simulated)",
    };
  }

  try {
    const messages = [
      {
        role: "system",
        content: `You are 'Kite Copilot', an expert, highly intelligent stock trading and financial assistant built into the Zerodha Kite platform.
You assist traders with technical analysis, stock queries, risk management, order types, and trading psychology.
Be concise, practical, professional, and friendly. You may understand both English and Hindi (Hinglish).
Always include a responsible reminder when recommending any trade.
${stockContext ? `Current stock in focus: ${JSON.stringify(stockContext)}` : ""}`,
      },
      ...chatHistory.slice(-6),
      {
        role: "user",
        content: message,
      },
    ];

    const completion = await client.chat.completions.create({
      messages,
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      max_tokens: 500,
    });

    return {
      reply: completion.choices[0]?.message?.content || "No response received from Groq.",
      poweredBy: "Groq Llama 3.3 70B",
    };
  } catch (error) {
    console.error("Groq chatCopilot error:", error.message);
    return {
      reply: `Error communicating with Groq API: ${error.message}. Please check your GROQ_API_KEY.`,
      poweredBy: "Groq AI (Error)",
    };
  }
};

module.exports = {
  analyzeStock,
  chatCopilot,
};
