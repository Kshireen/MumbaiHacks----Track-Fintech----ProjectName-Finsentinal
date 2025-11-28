// "use client";

// import { useState } from "react";

// export default function SimSwapCheck() {
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState(null);

//   const checkSim = async () => {
//     setLoading(true);

//     const res = await fetch("/api/sim-swap", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         phoneNumber: "+99999991000",
//         maxAge: 240,
//       }),
//     });

//     const data = await res.json();
//     console.log(data);
//     setResult(data);
//     setLoading(false);
//   };

//   return (
//     <div>
//       <button onClick={checkSim}>
//         {loading ? "Checking..." : "Check SIM Swap"}
//       </button>

//       {result && (
//         <pre>{JSON.stringify(result, null, 2)}</pre>
//       )}
//     </div>
//   );
// }




"use client";

import { useState } from "react";

export default function SimSwapChecker() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkSimSwap = async () => {
    setLoading(true);

    const res = await fetch("/api/sim-swap", {
      method: "POST",
      body: JSON.stringify({ phoneNumber }),
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <input
        className="border p-2 w-full rounded"
        placeholder="Enter phone number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />

      <button
        onClick={checkSimSwap}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Check SIM Swap
      </button>

      {loading && <p>Checking...</p>}

      {result && (
        <pre className="mt-4 p-2 bg-gray-400 rounded">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}


