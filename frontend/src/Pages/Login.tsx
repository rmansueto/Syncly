import { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { loginUser, getErrorMessage } from "../services/authService";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CalendarDaysIcon, 
  LinkIcon, 
  UserGroupIcon,
  ArrowPathIcon,
  ExclamationCircleIcon,
  EyeIcon,
  EyeSlashIcon
} from "@heroicons/react/24/outline";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // 1. Client-side Validation
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const resp = await loginUser({ email, password });
      if (resp?.token) {
        localStorage.setItem("token", resp.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${resp.token}`;
      }
      navigate("/dashboard");
    } catch (err: any) {
      // 2. Server-side Error Mapping
      const status = err.response?.status;
      if (status === 401) {
        setError("Invalid email or password. Please try again.");
      } else if (status === 404) {
        setError("Account not found. Check your email or sign up.");
      } else {
        setError(getErrorMessage(err) || "Connection error. Please try again.");
      }
      setIsSubmitting(false);
    }
  };

  // Helper to determine if an input has an error
  const hasEmailError = error.toLowerCase().includes("email") || error.includes("Account not found");
  const hasPassError = error.toLowerCase().includes("password") || error.includes("Invalid");

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* Left Branding Panel */}
      <div className="hidden lg:flex flex-col justify-between p-16 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <CalendarDaysIcon className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">Syncly</span>
          </div>
          
          <h1 className="text-5xl font-extrabold tracking-tight leading-tight">
            The world's easiest <br />
            <span className="text-indigo-500">scheduling</span> tool.
          </h1>
          <p className="mt-6 text-xl text-slate-400 max-w-md font-medium leading-relaxed">
            Eliminate back-and-forth emails. Set your availability and share a link.
          </p>
        </div>

        <div className="relative z-10 space-y-8">
          <Feature icon={<CalendarDaysIcon className="h-6 w-6" />} title="Smart Sync" desc="Connects with Google & Outlook" />
          <Feature icon={<LinkIcon className="h-6 w-6" />} title="Booking Links" desc="Unlimited personalized URLs" />
          <Feature icon={<UserGroupIcon className="h-6 w-6" />} title="Team Friendly" desc="Coordinate across timezones" />
        </div>

        <div className="relative z-10 text-slate-500 font-medium text-sm">
          <p>© {new Date().getFullYear()} Syncly Inc.</p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex items-center justify-center p-8 bg-slate-50/50">
        <motion.div
          animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-10 border border-slate-100">
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back</h2>
              <p className="text-slate-500 mt-2 font-medium">Log in to manage your schedule</p>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm p-4 flex items-start gap-3"
                >
                  <ExclamationCircleIcon className="h-5 w-5 shrink-0" />
                  <span className="font-semibold">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="group">
                <label className={`block text-xs font-bold mb-2 uppercase tracking-widest transition-colors ${hasEmailError ? 'text-red-500' : 'text-slate-500 group-focus-within:text-indigo-600'}`}>
                  Email Address
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                  className={`w-full px-4 py-4 rounded-xl border-2 bg-slate-50/50 outline-none transition-all font-medium placeholder:text-slate-400
                    ${hasEmailError 
                      ? "border-red-200 focus:border-red-500 focus:ring-4 focus:ring-red-50" 
                      : "border-slate-100 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50/50"
                    }`}
                  placeholder="name@company.com"
                />
              </div>

              <div className="group">
                <div className="flex justify-between items-center mb-2">
                  <label className={`block text-xs font-bold uppercase tracking-widest transition-colors ${hasPassError ? 'text-red-500' : 'text-slate-500 group-focus-within:text-indigo-600'}`}>
                    Password
                  </label>
                  <Link to="/forgot-password" hidden={hasPassError} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-wider">
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    required
                    className={`w-full px-4 py-4 rounded-xl border-2 bg-slate-50/50 outline-none transition-all font-medium placeholder:text-slate-400
                      ${hasPassError 
                        ? "border-red-200 focus:border-red-500 focus:ring-4 focus:ring-red-50" 
                        : "border-slate-100 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50/50"
                      }`}
                    placeholder="••••••••"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button
                disabled={isSubmitting}
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-200 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <ArrowPathIcon className="h-5 w-5 animate-spin" />
                ) : (
                  "Sign In to Dashboard"
                )}
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-slate-100 text-center">
              <p className="text-slate-500 font-medium">
                New to Syncly?{' '}
                <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-bold underline underline-offset-4 decoration-2">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-1 w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-indigo-400">
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-white tracking-tight">{title}</h4>
        <p className="text-slate-400 text-sm font-medium">{desc}</p>
      </div>
    </div>
  );
}