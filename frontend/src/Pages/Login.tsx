import { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { loginUser, getErrorMessage } from "../services/authService";
import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      const resp = await loginUser({ email, password });
      if (resp?.token) {
        localStorage.setItem("token", resp.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${resp.token}`;
      }
      navigate("/dashboard");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-50">
      {/* Left Branding Panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-indigo-600 to-blue-600 text-white">
        <div>
          <div className="text-3xl font-bold tracking-tight">Syncly</div>
          <p className="mt-6 text-lg text-indigo-100 max-w-md">
            Schedule smarter. Sync faster. Collaborate effortlessly.
          </p>
        </div>

        <div className="space-y-4">
          <Feature text="Smart calendar sync" />
          <Feature text="One-click meeting links" />
          <Feature text="Team availability tracking" />
        </div>

        <p className="text-sm text-indigo-200">© {new Date().getFullYear()} Syncly</p>
      </div>

      {/* Right Form Panel */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold text-slate-800">Welcome back</h2>
            <p className="text-slate-500 mt-1">Log in to your Syncly account</p>

            {error && (
              <div className="mt-4 rounded-lg bg-red-50 text-red-600 text-sm p-3">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    Forgot?
                  </Link>
                </div>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition shadow-md hover:shadow-lg"
              >
                Log in
              </button>
            </form>

            <p className="mt-6 text-sm text-center text-slate-600">
              Don’t have an account?{' '}
              <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Feature({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-2 h-2 rounded-full bg-white" />
      <span className="text-indigo-100">{text}</span>
    </div>
  );
}
