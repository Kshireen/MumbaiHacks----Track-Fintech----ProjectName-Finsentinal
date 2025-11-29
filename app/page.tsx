// app/page.tsx
"use client";

import { useState } from "react";
import SimSwap from "./component/SImSwap/SimSwap";
import SimpleNumberVerification from "./component/NumberVerification/NumberVerification";
import FinSentinelDashboard from "./component/FinSentinel/FinSentinelDashboard";

type TabType = "finsentinel" | "sim-swap" | "number-verify";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("finsentinel");

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {activeTab === "finsentinel" ? (
        // Full-screen FinSentinel Dashboard
        <div>
          <div className="fixed top-4 right-4 z-50">
            <button
              onClick={() => setActiveTab("sim-swap")}
              className="bg-white dark:bg-zinc-900 px-4 py-2 rounded-lg shadow-lg border border-gray-200 dark:border-zinc-800 hover:shadow-xl transition-shadow text-sm font-medium"
            >
              ← Switch to API Testing
            </button>
          </div>
          <FinSentinelDashboard />
        </div>
      ) : (
        // API Testing Interface
        <div className="flex min-h-screen items-center justify-center font-sans">
          <main className="flex min-h-screen w-full max-w-4xl flex-col py-8 px-4">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Network as Code
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    SIM Swap Detection & Number Verification APIs
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("finsentinel")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-shadow font-medium"
                >
                  🚀 Launch FinSentinel
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-zinc-800 mb-6 bg-white dark:bg-zinc-900 rounded-t-lg">
              <button
                onClick={() => setActiveTab("sim-swap")}
                className={`flex-1 px-6 py-4 font-medium border-b-2 transition-colors rounded-tl-lg ${
                  activeTab === "sim-swap"
                    ? "border-blue-600 text-blue-600 bg-blue-50 dark:bg-blue-950/30"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xl">🔄</span>
                  <span>SIM Swap Detection</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("number-verify")}
                className={`flex-1 px-6 py-4 font-medium border-b-2 transition-colors rounded-tr-lg ${
                  activeTab === "number-verify"
                    ? "border-purple-600 text-purple-600 bg-purple-50 dark:bg-purple-950/30"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xl">✓</span>
                  <span>Number Verification</span>
                </div>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 bg-white dark:bg-zinc-900 rounded-b-lg shadow-lg">
              {activeTab === "sim-swap" && <SimSwap />}
              {activeTab === "number-verify" && <SimpleNumberVerification />}
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 rounded-full shadow-sm border border-gray-200 dark:border-zinc-800">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Powered by
                </span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  Network as Code (NAC)
                </span>
                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                  via RapidAPI
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-3">
                🚀 Part of FinSentinel - AI Agents for Rural Fintech Security
              </p>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}