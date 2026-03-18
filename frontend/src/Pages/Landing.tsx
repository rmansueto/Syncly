import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  CalendarDaysIcon, 
  LinkIcon, 
  UserGroupIcon, 
  CheckCircleIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-100 selection:text-indigo-700">
      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 md:px-12">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-indigo-200 shadow-lg">
              <CalendarDaysIcon className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Syncly</span>
          </div>
          <nav className="flex items-center gap-8">
            <Link to="/login" className="hidden md:block text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
              Sign in
            </Link>
            <Link
              to="/register"
              className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold px-5 py-2.5 rounded-full transition-all shadow-md active:scale-95"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[120px] opacity-60" />
          <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-blue-50 rounded-full blur-[100px] opacity-60" />
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-6">
              <SparklesIcon className="h-4 w-4" />
              Scheduling for the future
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
              Focus on work, <br />
              <span className="text-indigo-600">not scheduling.</span>
            </h1>
            <p className="mt-8 text-xl text-slate-600 leading-relaxed max-w-lg">
              Syncly eliminates the friction of finding the perfect time. 
              Share your link and let the magic happen.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                to="/register"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-indigo-200 transition-all active:scale-95 text-center"
              >
                Create Free Account
              </Link>
              <div className="flex items-center gap-3 px-4 py-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />
                  ))}
                </div>
                <p className="text-sm font-medium text-slate-500">Joined by 2k+ users</p>
              </div>
            </div>
          </motion.div>

          {/* Interactive Preview Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500 to-blue-500 rounded-[2rem] opacity-10 blur-2xl" />
            <div className="relative bg-white border border-slate-200 rounded-3xl shadow-2xl p-2">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="font-bold text-slate-900">Pick a time</h3>
                    <p className="text-xs text-slate-500 font-medium">Friday, March 20</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <CheckCircleIcon className="h-5 w-5 text-indigo-600" />
                  </div>
                </div>
                
                <div className="space-y-3">
                  {['9:00 AM', '11:30 AM', '2:00 PM'].map((time, idx) => (
                    <motion.div 
                      key={time}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + (idx * 0.1) }}
                      className={`p-4 rounded-xl border-2 font-bold text-center transition-all cursor-pointer
                        ${idx === 1 ? 'border-indigo-600 bg-white text-indigo-600 shadow-md' : 'border-white bg-white text-slate-400'}`}
                    >
                      {time}
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 shadow-lg" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">Meeting with Alex</p>
                      <p className="text-[10px] font-medium text-slate-400 tracking-wide uppercase">30 MIN • ZOOM VIDEO</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-50/50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Everything you need to <br />manage your time.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Feature 
              icon={<CalendarDaysIcon className="h-6 w-6" />}
              title="Smart Sync"
              desc="Deep integration with Google and Outlook. Say goodbye to double bookings forever."
            />
            <Feature 
              icon={<LinkIcon className="h-6 w-6" />}
              title="Personal Links"
              desc="Create unlimited booking pages for different meeting types and durations."
            />
            <Feature 
              icon={<UserGroupIcon className="h-6 w-6" />}
              title="Team Analytics"
              desc="Track meeting volume and availability across your entire organization."
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 md:px-12 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-8">
            Ready to reclaim your calendar?
          </h2>
          <Link
            to="/register"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-10 py-5 rounded-2xl shadow-2xl shadow-indigo-200 transition-all active:scale-95"
          >
            Get Started for Free
          </Link>
          <p className="mt-6 text-slate-400 font-medium">No credit card required. Setup in 2 minutes.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 grayscale opacity-50">
            <div className="w-6 h-6 bg-slate-900 rounded-md" />
            <span className="font-bold text-slate-900">Syncly</span>
          </div>
          <p className="text-sm font-medium text-slate-400">
            © {new Date().getFullYear()} Syncly Inc. Built for faster teams.
          </p>
        </div>
      </footer>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
        {icon}
      </div>
      <h4 className="font-bold text-xl text-slate-900 mb-3 tracking-tight">{title}</h4>
      <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}