"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { Button } from "@hunar/ui";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      router.push("/account");
    } catch (error: any) {
      console.error("Login error:", error);
      const message = String(error?.message || "");
      if (message.toLowerCase().includes("invalid login")) {
        setError("Invalid email or password");
      } else if (message.toLowerCase().includes("email")) {
        setError(message);
      } else {
        setError(message || "An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-custom py-12">
      <div className="max-w-md mx-auto">
        <h1 className="text-4xl font-serif font-bold text-brown mb-6 text-center">
          Sign In
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-3 rounded-2xl border border-brown/20 focus:border-brown focus:outline-none focus:ring-2 focus:ring-brown/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-4 py-3 rounded-2xl border border-brown/20 focus:border-brown focus:outline-none focus:ring-2 focus:ring-brown/20"
            />
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-charcoal/70 text-sm">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-brown font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-charcoal/50">
            Demo: Use admin@hunar.com / admin123 for admin access
          </p>
        </div>
      </div>
    </div>
  );
}

