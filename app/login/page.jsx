"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/vendor/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ number, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }
      router.push("/");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full sm:w-96 ">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Vendor Login
        </h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
                required
                value={number}
                placeholder="
              Mobile No."
                onChange={(e) => setNumber(e.target.value)}
              />
            </label>
          </div>
          <div className="mb-6">
            <label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 mt-3 flex justify-center"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
