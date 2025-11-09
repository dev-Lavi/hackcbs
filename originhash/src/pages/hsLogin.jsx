import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Building2, Mail, Lock, AlertCircle, Eye, EyeOff } from "lucide-react";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

export default function HospitalLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/api/hospital-registration/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("hospitalId", data.user.hospital.id);
        alert("✅ Login successful! Welcome back, " + data.user.name);
        navigate("/admin/patientAssign");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Error connecting to server. Please check if backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-md my-6"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 220 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-sky-500 to-sky-600 shadow-lg ring-1 ring-sky-200 mb-4"
          >
            <Building2 className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-[32px] font-extrabold tracking-tight text-gray-900">Hospital Login</h1>
          <p className="text-gray-600">Access your hospital admin dashboard</p>
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-rose-50 ring-1 ring-rose-200 rounded-xl flex items-center gap-2"
          >
            <AlertCircle className="h-5 w-5 text-rose-600 flex-shrink-0" />
            <span className="text-rose-800 text-sm">{error}</span>
          </motion.div>
        )}

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05 }}
          className="bg-white/95 rounded-2xl shadow-[0_18px_50px_rgba(2,6,23,0.06)] ring-1 ring-slate-100 p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="email" name="email" value={formData.email} onChange={handleInputChange} required
                  className="w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                  placeholder="admin@hospital.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleInputChange} required
                  className="w-full pl-11 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="w-4 h-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500" />
                <span className="ml-2 text-sm text-slate-600">Remember me</span>
              </label>
              <button type="button" className="text-sm text-sky-700 hover:text-sky-800 font-semibold">
                Forgot password?
              </button>
            </div>

            {/* CTA */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full h-12 rounded-xl font-semibold text-white bg-gradient-to-r from-[#69B6FF] via-[#3B8DFF] to-[#277FFF] shadow-[0_10px_30px_rgba(39,127,255,0.30)] hover:shadow-[0_16px_36px_rgba(39,127,255,0.40)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                "Login to Dashboard"
              )}
            </motion.button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-500">New to our platform?</span>
              </div>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-slate-600 text-sm mb-3">Don't have an account yet?</p>
              <button
                type="button"
                onClick={() => navigate("/Registerhp")}
                className="w-full h-11 rounded-xl font-semibold border-2 border-sky-600 text-sky-700 hover:bg-sky-50 transition"
              >
                Register Your Hospital
              </button>
            </div>
          </form>
        </motion.div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-slate-500 mb-2">
            Need help? Contact support at{" "}
            <a href="mailto:support@hospital.com" className="text-sky-700 hover:underline font-semibold">
              support@hospital.com
            </a>
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
            <a href="#" className="hover:text-slate-600">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-600">Terms of Service</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-600">Help Center</a>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
