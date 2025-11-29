// app/component/NumberVerification/SimpleNumberVerification.tsx
"use client";

import { useState } from "react";

export default function SimpleNumberVerification() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verifyMode, setVerifyMode] = useState<"compare" | "retrieve">("compare");
  const [useProduction, setUseProduction] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const verifyNumber = async () => {
    if (!phoneNumber) return;
    
    setLoading(true);
    setResult(null);

    try {
      let endpoint = "";
      let body: any = {};

      if (useProduction) {
        // Production NAC API
        if (verifyMode === "compare") {
          endpoint = "/api/number-verification/verify";
          body = { phoneNumber };
        } else {
          endpoint = "/api/number-verification/device-phone-number";
          // GET request doesn't need body
        }
      } else {
        // Mock/Simulated API
        endpoint = "/api/number-verification/simulate";
        body = { phoneNumber, mode: verifyMode };
      }

      const options: RequestInit = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      };

      if (Object.keys(body).length > 0) {
        options.body = JSON.stringify(body);
      }

      const res = await fetch(endpoint, options);
      const data = await res.json();
      setResult(data);
    } catch (error) {
      setResult({ success: false, error: "Request failed" });
    }

    setLoading(false);
  };

  const clearResult = () => {
    setResult(null);
    setPhoneNumber("");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Number Verification</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Verify phone numbers using {useProduction ? "Production NAC" : "Simulated"} API
        </p>
      </div>
      
      <div className="space-y-6">
        {/* API Mode Toggle */}
        <div className="border rounded-lg p-4 bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium mb-1">API Mode</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {useProduction ? "Using production NAC API" : "Using simulated responses"}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={useProduction}
                onChange={(e) => setUseProduction(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ms-3 text-sm font-medium">
                {useProduction ? "Production" : "Mock"}
              </span>
            </label>
          </div>
          
          {useProduction && (
            <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs text-blue-700 dark:text-blue-300">
              ⚠️ Production mode requires valid RAPID_API_KEY in .env.local
            </div>
          )}
        </div>

        {/* Verification Mode */}
        <div className="border rounded-lg p-4 bg-white dark:bg-zinc-900">
          <label className="block text-sm font-medium mb-3">
            Verification Mode
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="mode"
                value="compare"
                checked={verifyMode === "compare"}
                onChange={(e) => setVerifyMode(e.target.value as "compare")}
                className="mr-2"
              />
              <span>Compare & Verify</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="mode"
                value="retrieve"
                checked={verifyMode === "retrieve"}
                onChange={(e) => setVerifyMode(e.target.value as "retrieve")}
                className="mr-2"
              />
              <span>Retrieve Device Number</span>
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {verifyMode === "compare" 
              ? "Compares provided number with device SIM number (returns true/false)"
              : "Returns the actual phone number from the device SIM"}
          </p>
        </div>

        {/* Phone Number Input */}
        <div className="border rounded-lg p-4 bg-white dark:bg-zinc-900">
          <label className="block text-sm font-medium mb-2">
            Phone Number {verifyMode === "compare" && "(to verify)"}
          </label>
          <input
            type="tel"
            className="border p-3 w-full rounded dark:bg-zinc-800 text-lg"
            placeholder="+1234567890"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          
          {/* Test Numbers Info */}
          {!useProduction && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-sm text-blue-800 dark:text-blue-200 mb-2">
                📱 Simulated Test Numbers
              </h4>
              <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                <div><code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">+99999991000</code> - Valid, matches device</div>
                <div><code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">+99999991001</code> - Valid, doesn't match device</div>
                <div><code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">+99999991002</code> - Invalid/inactive number</div>
                <div><code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">+99999991003</code> - Network error simulation</div>
              </div>
            </div>
          )}

          {useProduction && (
            <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded border border-purple-200 dark:border-purple-800">
              <h4 className="font-semibold text-sm text-purple-800 dark:text-purple-200 mb-2">
                📱 NAC Simulator Numbers
              </h4>
              <div className="text-xs text-purple-700 dark:text-purple-300 space-y-1">
                <div><code className="bg-purple-100 dark:bg-purple-900 px-2 py-1 rounded">+99999991000</code> - Use for testing with NAC API</div>
                <div><code className="bg-purple-100 dark:bg-purple-900 px-2 py-1 rounded">+99999991001</code> - Alternative test number</div>
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={verifyNumber}
          disabled={loading || !phoneNumber}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium disabled:bg-gray-400 hover:bg-blue-700 transition-colors"
        >
          {loading ? "Verifying..." : verifyMode === "compare" ? "Verify Number" : "Get Device Number"}
        </button>

        {/* Results */}
        {result && (
          <div className="border rounded-lg p-4 bg-white dark:bg-zinc-900">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-lg">Result</h3>
              <button
                onClick={clearResult}
                className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Clear
              </button>
            </div>
            
            {result.success ? (
              <div>
                {/* Compare Mode Result */}
                {verifyMode === "compare" && result.data.devicePhoneNumberVerified !== undefined && (
                  <div className={`p-4 rounded-lg mb-3 ${
                    result.data.devicePhoneNumberVerified 
                      ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                      : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">
                        {result.data.devicePhoneNumberVerified ? "✓" : "✗"}
                      </span>
                      <span className={`font-semibold ${
                        result.data.devicePhoneNumberVerified 
                          ? "text-green-800 dark:text-green-200"
                          : "text-red-800 dark:text-red-200"
                      }`}>
                        {result.data.devicePhoneNumberVerified ? "Verified" : "Not Verified"}
                      </span>
                    </div>
                    <p className={`text-sm ${
                      result.data.devicePhoneNumberVerified 
                        ? "text-green-700 dark:text-green-300"
                        : "text-red-700 dark:text-red-300"
                    }`}>
                      {result.data.message || (result.data.devicePhoneNumberVerified 
                        ? "Phone number matches device SIM"
                        : "Phone number does not match device SIM")}
                    </p>
                  </div>
                )}

                {/* Retrieve Mode Result */}
                {verifyMode === "retrieve" && result.data.devicePhoneNumber && (
                  <div className="p-4 rounded-lg mb-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">📱</span>
                      <span className="font-semibold text-green-800 dark:text-green-200">
                        Device Phone Number
                      </span>
                    </div>
                    <p className="text-lg font-mono text-green-700 dark:text-green-300">
                      {result.data.devicePhoneNumber}
                    </p>
                  </div>
                )}

                {/* Raw Response */}
                <details className="mt-3">
                  <summary className="cursor-pointer text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                    View Raw Response
                  </summary>
                  <pre className="mt-2 p-3 bg-gray-100 dark:bg-zinc-800 rounded text-xs overflow-x-auto">
{JSON.stringify(result, null, 2)}
                  </pre>
                </details>
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">⚠️</span>
                  <span className="font-semibold text-red-800 dark:text-red-200">
                    Error
                  </span>
                </div>
                <p className="text-sm text-red-700 dark:text-red-300">
                  {result.data?.detail || result.data?.message || result.error || "Verification failed"}
                </p>
                {result.data?.status && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    Status: {result.data.status} {result.data.code && `(${result.data.code})`}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Info Box */}
        <div className="border rounded-lg p-4 bg-gray-50 dark:bg-zinc-900">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <span>ℹ️</span>
            How It Works
          </h3>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <p>
              <strong>Compare Mode:</strong> Checks if the provided phone number matches the device's SIM card number. Returns true/false.
            </p>
            <p>
              <strong>Retrieve Mode:</strong> Returns the actual phone number associated with the device's SIM card.
            </p>
            <p className="text-xs pt-2 border-t border-gray-200 dark:border-zinc-700">
              💡 {useProduction 
                ? "Production mode uses real NAC API with OAuth 2.0 authentication."
                : "Mock mode uses simulated responses - perfect for demos and testing!"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}