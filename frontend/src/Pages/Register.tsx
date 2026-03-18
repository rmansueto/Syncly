import { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { registerUser, loginUser, getErrorMessage } from "../services/authService";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CalendarDaysIcon, 
  ArrowPathIcon,
  ExclamationCircleIcon,
  CheckBadgeIcon,
  ShieldCheckIcon,
  EyeIcon,
  EyeSlashIcon
} from "@heroicons/react/24/outline";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Visibility toggles (UX for unmasking)
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (username.length < 3) {
      setError("Name must be at least 3 characters.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await registerUser({ username, email, password });
      const loginResp = await loginUser({ email, password });
      if (loginResp?.token) {
        localStorage.setItem("token", loginResp.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${loginResp.token}`;
      }
      navigate("/dashboard");
    } catch (err: any) {
      setError(getErrorMessage(err) || "Registration failed. Email might be taken.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* Left Branding Panel */}
      <div className="hidden lg:flex flex-col justify-between p-16 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <CalendarDaysIcon className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">Syncly</span>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight leading-tight">
            Start scheduling <br />
            <span className="text-indigo-500">smarter</span> today.
          </h1>
        </div>

        <div className="relative z-10 space-y-8">
          <Feature icon={<CheckBadgeIcon className="h-6 w-6" />} title="Free Forever" desc="Basic scheduling is always free" />
          <Feature icon={<ShieldCheckIcon className="h-6 w-6" />} title="Secure Sync" desc="Your data is always encrypted" />
        </div>

        <div className="relative z-10 text-slate-500 text-sm font-medium">
          <p>© {new Date().getFullYear()} Syncly Inc.</p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex items-center justify-center p-8 bg-slate-50/50">
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-10 border border-slate-100">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Create Account</h2>
              <p className="text-slate-500 mt-2 font-medium">Join Syncly for free</p>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-6 bg-red-50 text-red-700 text-sm p-4 rounded-xl border border-red-100 flex items-center gap-3">
                  <ExclamationCircleIcon className="h-5 w-5 shrink-0" />
                  <span className="font-semibold">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="group">
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Full Name"
                  required
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-indigo-600 outline-none transition-all font-medium"
                />
              </div>

              <div className="group">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Email Address"
                  required
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-indigo-600 outline-none transition-all font-medium"
                />
              </div>

              <div className="relative group">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-indigo-600 outline-none transition-all font-medium"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600">
                  {showPass ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>

              <div className="relative group">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  required
                  className={`w-full px-4 py-3.5 rounded-xl border-2 bg-slate-50/50 outline-none transition-all font-medium ${confirmPassword && password === confirmPassword ? 'border-emerald-100' : 'border-slate-100 focus:border-indigo-600'}`}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600">
                  {showConfirm ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>

              <button
                disabled={isSubmitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-200 active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
              >
                {isSubmitting ? <ArrowPathIcon className="h-5 w-5 animate-spin" /> : "Create Account"}
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-slate-100 text-center">
              <p className="text-slate-500 font-medium">
                Already have an account?{' '}
                <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-bold underline underline-offset-4 decoration-2">
                  Sign in
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
      <div className="mt-1 w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-indigo-400">{icon}</div>
      <div>
        <h4 className="font-bold text-white tracking-tight">{title}</h4>
        <p className="text-slate-400 text-sm font-medium">{desc}</p>
      </div>
    </div>
  );
}