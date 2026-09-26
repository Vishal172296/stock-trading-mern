import React, { useState, useRef, useEffect } from "react";
import api from "../api";

const AiCopilotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Namaste! I am Kite Copilot powered by Groq Llama 3.3. How can I help with your trading, market analysis, or risk management today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (messageToSend) => {
    const text = messageToSend || input;
    if (!text || text.trim() === "") return;

    const userMessage = { sender: "user", text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const chatHistory = messages.map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text,
      }));

      const res = await api.post("/api/ai/copilot", {
        message: text,
        chatHistory,
      });

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: res.data.reply || "No response received.",
          poweredBy: res.data.poweredBy,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Sorry, I encountered an issue connecting to Groq AI. Please check your backend connection.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    "Explain Risk Management",
    "What is Stop-Loss (SL)?",
    "How to read RSI?",
    "Best swing trading strategy",
  ];

  return (
    <>
      {/* Floating launcher button */}
      <div
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 999,
        }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
            color: "#fff",
            border: "none",
            borderRadius: "30px",
            padding: "12px 20px",
            fontSize: "0.95rem",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "transform 0.2s ease",
          }}
        >
          <span style={{ fontSize: "1.2rem" }}>🤖</span>
          <span>Kite AI Copilot</span>
          <span
            style={{
              fontSize: "0.65rem",
              background: "#ff5722",
              padding: "2px 6px",
              borderRadius: "10px",
            }}
          >
            GROQ
          </span>
        </button>
      </div>

      {/* Chat drawer */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            right: "24px",
            width: "360px",
            height: "500px",
            backgroundColor: "#fff",
            borderRadius: "12px",
            boxShadow: "0 12px 35px rgba(0,0,0,0.22)",
            display: "flex",
            flexDirection: "column",
            zIndex: 1000,
            overflow: "hidden",
            border: "1px solid #e0e0e0",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
              color: "#fff",
              padding: "14px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>
                ⚡ Kite AI Copilot
              </div>
              <div style={{ fontSize: "0.75rem", opacity: 0.85 }}>
                Powered by Groq Llama 3.3
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "#fff",
                fontSize: "1.2rem",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>

          {/* Quick Prompts */}
          <div
            style={{
              padding: "8px 10px",
              background: "#f8f9fa",
              borderBottom: "1px solid #eee",
              display: "flex",
              gap: "6px",
              overflowX: "auto",
              whiteSpace: "nowrap",
            }}
          >
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                style={{
                  background: "#fff",
                  border: "1px solid #ddd",
                  borderRadius: "12px",
                  padding: "4px 8px",
                  fontSize: "0.72rem",
                  cursor: "pointer",
                  color: "#444",
                }}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Messages list */}
          <div
            style={{
              flex: 1,
              padding: "14px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              background: "#fafafa",
            }}
          >
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: m.sender === "user" ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                  backgroundColor: m.sender === "user" ? "#4184f3" : "#ffffff",
                  color: m.sender === "user" ? "#ffffff" : "#222222",
                  padding: "9px 13px",
                  borderRadius:
                    m.sender === "user"
                      ? "12px 12px 2px 12px"
                      : "12px 12px 12px 2px",
                  fontSize: "0.85rem",
                  lineHeight: "1.4",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                  whiteSpace: "pre-wrap",
                }}
              >
                {m.text}
              </div>
            ))}
            {loading && (
              <div
                style={{
                  alignSelf: "flex-start",
                  backgroundColor: "#ffffff",
                  color: "#888",
                  padding: "8px 12px",
                  borderRadius: "12px",
                  fontSize: "0.8rem",
                }}
              >
                Groq AI is thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input box */}
          <div
            style={{
              padding: "10px",
              borderTop: "1px solid #eee",
              display: "flex",
              gap: "8px",
              backgroundColor: "#fff",
            }}
          >
            <input
              type="text"
              placeholder="Ask anything about stocks..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              style={{
                flex: 1,
                border: "1px solid #ddd",
                borderRadius: "20px",
                padding: "8px 14px",
                fontSize: "0.85rem",
                outline: "none",
              }}
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              style={{
                background: "#4184f3",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1rem",
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AiCopilotWidget;
