"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Mail, Lock, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { Alert } from "@/components/ui/Alert";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setSuccessMessage("Account created successfully! Please log in.");
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Dynamic imports
      const { authApi } = await import("@/lib/api");
      const { setAccessToken } = await import("@/lib/auth");
      
      const response = await authApi.login(email, password);
      setAccessToken(response.data.access_token);
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message || 
        "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white border-2 border-purple-200 shadow-xl rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-purple-300 opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-purple-200 opacity-20 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-300">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Log in to continue building forms
          </p>

          {successMessage && (
            <Alert type="success" className="mb-4">
              {successMessage}
            </Alert>
          )}

          {error && (
            <Alert type="error" className="mb-4">
              {error}
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-gray-700 font-medium mb-1 block">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-400 outline-none transition bg-purple-50/30"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="text-gray-700 font-medium mb-1 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-400 outline-none transition bg-purple-50/30"
                  placeholder="••••••••"
                />
              </div>
            </div>


            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold text-lg hover:bg-purple-700 hover:shadow-xl hover:scale-[1.02] transition flex justify-center items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <p className="text-center text-gray-600 text-sm">
              Don't have an account?{" "}
              <a
                href="/auth/signup"
                className="text-purple-600 font-semibold hover:underline"
              >
                Create one
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}