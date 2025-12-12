"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { Mail, Lock, User, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { authApi } from "@/lib/api";
import { Alert } from "@/components/ui/Alert";

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await authApi.signup({
        firstName,
        lastName,
        email,
        password,
      });

      // Redirect to login after successful registration
      router.push("/auth/login?registered=true");
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(
        err.response?.data?.message || 
        "Failed to create account. Please try again."
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
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-300">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
            Create Your Account
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Start building AI-powered forms today
          </p>

          {/* Error Alert */}
          {error && (
            <Alert type="error" className="mb-4">
              {error}
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-5">
            {/* First Name */}
            <div>
              <label className="text-gray-700 font-medium mb-1 block">
                First Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-400 outline-none transition bg-purple-50/30"
                  placeholder="John"
                />
              </div>
            </div>

            {/* Last Name */}
            <div>
              <label className="text-gray-700 font-medium mb-1 block">
                Last Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-400 outline-none transition bg-purple-50/30"
                  placeholder="Doe"
                />
              </div>
            </div>

            {/* Email */}
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

            {/* Password */}
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
                  minLength={6}
                  className="w-full pl-10 pr-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-400 outline-none transition bg-purple-50/30"
                  placeholder="••••••••"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Must be at least 6 characters
              </p>
            </div>

            {/* Submit */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold text-lg hover:bg-purple-700 hover:shadow-xl hover:scale-[1.02] transition flex justify-center items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Switch to Login */}
            <p className="text-center text-gray-600 text-sm">
              Already have an account?{" "}
              <a
                href="/auth/login"
                className="text-purple-600 font-semibold hover:underline"
              >
                Log in
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}