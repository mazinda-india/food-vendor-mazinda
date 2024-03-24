"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Logo from "@/public/logoMain.png";
import { Loader2 } from "lucide-react";

const LoginPage = () => {
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center flex-col">
      <Image src={Logo} height={50} className="my-10" />
      <div className="bg-white p-8 rounded-lg border w-full sm:w-96 ">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Vendor Login
        </h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <input
              type="text"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
              required
              value={number}
              placeholder="
              Mobile No."
              onChange={(e) => setNumber(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {loading ? (
            <Button className="w-full" disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button type="submit" className="w-full">
              Login
            </Button>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
