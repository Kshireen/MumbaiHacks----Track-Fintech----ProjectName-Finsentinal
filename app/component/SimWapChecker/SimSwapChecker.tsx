// components/SimSwapChecker.tsx
"use client";

import { useState } from "react";

export default function SimSwapChecker() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [risk, setRisk] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const check = async () => {
    setLoading(true);
    setError(null);
    setRisk(null);

    try {
      const res = await fetch("/api/sim-swap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phone, maxAge: 240 }),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.message || "Request failed");
      } else {
        setRisk(json.risk);
      }
    } catch (e: any) {
      setError(e.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-lg">
      <label className="block mb-2">Phone number</label>
      <input
        className="border p-2 rounded w-full mb-3"
        value={phone}
        placeholder="+919999999999"
        onChange={(e) => setPhone(e.target.value)}
      />
      <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={check} disabled={loading}>
        {loading ? "Checking…" : "Check SIM Swap"}
      </button>

      {error && <div className="mt-4 text-red-600">{error}</div>}

      {risk && (
        <div className="mt-4 p-3 border rounded">
          <div><strong>Decision:</strong> {risk.decision}</div>
          <div><strong>Score:</strong> {risk.score}</div>
          <div><strong>Reasons:</strong>
            <ul className="list-disc ml-6">
              {risk.reasons.map((r: string, i: number) => <li key={i}>{r}</li>)}
            </ul>
          </div>
          <div><strong>Actions taken:</strong>
            <ul className="list-disc ml-6">
              {risk.actions.map((a: string, i: number) => <li key={i}>{a}</li>)}
            </ul>
          </div>
          <details className="mt-2">
            <summary className="cursor-pointer">Raw NAC response</summary>
            <pre className="text-xs mt-2">{JSON.stringify(risk.simApi.raw, null, 2)}</pre>
          </details>
        </div>
      )}
    </div>
  );
}
