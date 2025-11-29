// app/component/FinSentinel/FinSentinelDashboard.tsx
"use client";

import { useState } from "react";

type AgentType = "onboarding" | "transaction" | "analytics";

export default function FinSentinelDashboard() {
  const [activeAgent, setActiveAgent] = useState<AgentType>("onboarding");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Onboarding State
  const [onboardingData, setOnboardingData] = useState({
    phoneNumber: "",
    userName: "",
    language: "en",
  });

  // Transaction State
  const [transactionData, setTransactionData] = useState({
    phoneNumber: "",
    transactionAmount: "",
    transactionType: "payment",
    merchantName: "",
  });

  const runOnboardingAgent = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/agents/onboarding-agents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(onboardingData),
      });

      const data = await res.json();
      setResult(data);
    } catch (error) {
      setResult({ success: false, error: "Request failed" });
    }

    setLoading(false);
  };

  const runTransactionAgent = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/agents/transaction-agents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...transactionData,
          transactionAmount: parseFloat(transactionData.transactionAmount),
        }),
      });

      const data = await res.json();
      setResult(data);
    } catch (error) {
      setResult({ success: false, error: "Request failed" });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            FinSentinel
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            AI Agents Securing Every Rural Transaction
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            Powered by LangChain + Nokia NAC + Exotel IVR
          </p>
        </div>

        {/* Agent Selector */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveAgent("onboarding")}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeAgent === "onboarding"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/50"
                : "bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:shadow-md"
            }`}
          >
            🚀 Onboarding Agent
          </button>
          <button
            onClick={() => setActiveAgent("transaction")}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeAgent === "transaction"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-500/50"
                : "bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:shadow-md"
            }`}
          >
            💳 Transaction Agent
          </button>
          <button
            onClick={() => setActiveAgent("analytics")}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeAgent === "analytics"
                ? "bg-pink-600 text-white shadow-lg shadow-pink-500/50"
                : "bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:shadow-md"
            }`}
          >
            📊 Analytics Agent
          </button>
        </div>

        {/* Agent Interfaces */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Input */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl p-6 border border-gray-200 dark:border-zinc-800">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              {activeAgent === "onboarding" && "🚀 Onboarding Agent"}
              {activeAgent === "transaction" && "💳 Transaction Monitoring"}
              {activeAgent === "analytics" && "📊 Analytics Agent"}
            </h2>

            {/* Onboarding Form */}
            {activeAgent === "onboarding" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    className="w-full p-3 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700"
                    placeholder="+911234567890"
                    value={onboardingData.phoneNumber}
                    onChange={(e) =>
                      setOnboardingData({ ...onboardingData, phoneNumber: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">User Name</label>
                  <input
                    type="text"
                    className="w-full p-3 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700"
                    placeholder="Rajesh Kumar"
                    value={onboardingData.userName}
                    onChange={(e) =>
                      setOnboardingData({ ...onboardingData, userName: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Language</label>
                  <select
                    className="w-full p-3 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700"
                    value={onboardingData.language}
                    onChange={(e) =>
                      setOnboardingData({ ...onboardingData, language: e.target.value })
                    }
                  >
                    <option value="en">English</option>
                    <option value="hi">हिंदी (Hindi)</option>
                    <option value="te">తెలుగు (Telugu)</option>
                    <option value="ta">தமிழ் (Tamil)</option>
                  </select>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-sm mb-2 text-blue-800 dark:text-blue-200">
                    🤖 Agent Will Execute:
                  </h4>
                  <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                    <li>✓ Check SIM Swap status</li>
                    <li>✓ Verify phone number ownership</li>
                    <li>✓ Validate device status</li>
                    <li>✓ Confirm user location</li>
                    <li>✓ Calculate risk score</li>
                    <li>✓ Make approval decision</li>
                  </ul>
                </div>

                <button
                  onClick={runOnboardingAgent}
                  disabled={loading || !onboardingData.phoneNumber}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                >
                  {loading ? "🤖 Agent Working..." : "🚀 Start Onboarding"}
                </button>
              </div>
            )}

            {/* Transaction Form */}
            {activeAgent === "transaction" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    className="w-full p-3 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700"
                    placeholder="+911234567890"
                    value={transactionData.phoneNumber}
                    onChange={(e) =>
                      setTransactionData({ ...transactionData, phoneNumber: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Transaction Amount (₹) *
                  </label>
                  <input
                    type="number"
                    className="w-full p-3 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700"
                    placeholder="5000"
                    value={transactionData.transactionAmount}
                    onChange={(e) =>
                      setTransactionData({
                        ...transactionData,
                        transactionAmount: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Transaction Type
                  </label>
                  <select
                    className="w-full p-3 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700"
                    value={transactionData.transactionType}
                    onChange={(e) =>
                      setTransactionData({
                        ...transactionData,
                        transactionType: e.target.value,
                      })
                    }
                  >
                    <option value="payment">Payment</option>
                    <option value="transfer">Transfer</option>
                    <option value="withdrawal">Withdrawal</option>
                    <option value="bill-payment">Bill Payment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Merchant Name
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700"
                    placeholder="Amazon / Local Kirana"
                    value={transactionData.merchantName}
                    onChange={(e) =>
                      setTransactionData({ ...transactionData, merchantName: e.target.value })
                    }
                  />
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                  <h4 className="font-semibold text-sm mb-2 text-purple-800 dark:text-purple-200">
                    🤖 Agent Will Monitor:
                  </h4>
                  <ul className="text-xs text-purple-700 dark:text-purple-300 space-y-1">
                    <li>✓ Recent SIM swap (24 hours)</li>
                    <li>✓ Device authenticity</li>
                    <li>✓ Location anomalies</li>
                    <li>✓ Transaction patterns</li>
                    <li>✓ Real-time risk scoring</li>
                    <li>✓ Auto-alert if suspicious</li>
                  </ul>
                </div>

                <button
                  onClick={runTransactionAgent}
                  disabled={
                    loading ||
                    !transactionData.phoneNumber ||
                    !transactionData.transactionAmount
                  }
                  className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-400 transition-colors"
                >
                  {loading ? "🤖 Agent Monitoring..." : "💳 Monitor Transaction"}
                </button>
              </div>
            )}

            {/* Analytics (Coming Soon) */}
            {activeAgent === "analytics" && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-semibold mb-2">Analytics Agent</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Coming soon: Behavioral analysis, pattern detection, and actionable insights
                </p>
              </div>
            )}
          </div>

          {/* Right Panel - Results */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl p-6 border border-gray-200 dark:border-zinc-800">
            <h2 className="text-2xl font-bold mb-6">🎯 Agent Response</h2>

            {!result && !loading && (
              <div className="text-center py-12 text-gray-400">
                <div className="text-6xl mb-4">🤖</div>
                <p>Run an agent to see results here</p>
              </div>
            )}

            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin text-6xl mb-4">⚙️</div>
                <p className="text-gray-600 dark:text-gray-400">
                  Agent executing workflow...
                </p>
              </div>
            )}

            {result && !loading && (
              <div className="space-y-4">
                {/* Status Badge */}
                {result.data?.status && (
                  <div
                    className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                      result.data.status === "approved" || result.data.approved
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                        : result.data.status === "rejected" || result.data.blocked
                        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                    }`}
                  >
                    {result.data.status || (result.data.approved ? "Approved" : "Blocked")}
                  </div>
                )}

                {/* Risk Score */}
                {result.data?.riskScore !== undefined && (
                  <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Risk Score</span>
                      <span className="text-2xl font-bold">{result.data.riskScore}/100</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-zinc-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          result.data.riskScore < 40
                            ? "bg-green-500"
                            : result.data.riskScore < 70
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${result.data.riskScore}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Messages */}
                {result.data?.messages && (
                  <div className="space-y-2">
                    <h3 className="font-semibold">Agent Messages:</h3>
                    {result.data.messages.map((msg: any, idx: number) => (
                      <div
                        key={idx}
                        className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-sm border border-blue-200 dark:border-blue-800"
                      >
                        {msg.content || msg.text}
                      </div>
                    ))}
                  </div>
                )}

                {/* Transaction Decision */}
                {result.data?.message && (
                  <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Decision:</h3>
                    <p className="text-sm">{result.data.message}</p>
                  </div>
                )}

                {/* Raw Response */}
                <details>
                  <summary className="cursor-pointer text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800">
                    View Full Response
                  </summary>
                  <pre className="mt-2 p-3 bg-gray-100 dark:bg-zinc-800 rounded text-xs overflow-x-auto">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </details>
              </div>
            )}
          </div>
        </div>

        {/* Architecture Diagram */}
        <div className="mt-8 bg-white dark:bg-zinc-900 rounded-xl shadow-xl p-6 border border-gray-200 dark:border-zinc-800">
          <h2 className="text-2xl font-bold mb-4">🏗️ System Architecture</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="font-semibold mb-2">🧠 LangChain Agents</h3>
              <ul className="text-xs space-y-1 text-gray-700 dark:text-gray-300">
                <li>• Master Orchestrator</li>
                <li>• Onboarding Agent</li>
                <li>• Transaction Monitor</li>
                <li>• Analytics Agent</li>
              </ul>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h3 className="font-semibold mb-2">🛠️ Tools (Nokia NAC)</h3>
              <ul className="text-xs space-y-1 text-gray-700 dark:text-gray-300">
                <li>• SIM Swap Detection</li>
                <li>• Number Verification</li>
                <li>• Device Status</li>
                <li>• Location Verify</li>
              </ul>
            </div>
            <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
              <h3 className="font-semibold mb-2">📞 Exotel IVR</h3>
              <ul className="text-xs space-y-1 text-gray-700 dark:text-gray-300">
                <li>• Voice Onboarding</li>
                <li>• Fraud Alerts</li>
                <li>• Regional Languages</li>
                <li>• Feature Phone Support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}