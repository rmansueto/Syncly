import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="flex items-center justify-between px-6 py-4 md:px-12">
        <div className="text-2xl font-bold tracking-tight text-indigo-600">Syncly</div>
        <nav className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow"
          >
            Get Started
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="px-6 md:px-12 py-16 md:py-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
              Scheduling that just works.
            </h1>
            <p className="mt-6 text-lg text-slate-600 leading-relaxed">
              Syncly helps you book meetings faster, avoid calendar clashes,
              and stay perfectly in sync with your team — without the endless
              back-and-forth messages.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                to="/register"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-lg shadow-lg text-center"
              >
                Create free account
              </Link>
              <Link
                to="/login"
                className="border border-slate-300 hover:border-slate-400 text-slate-700 font-medium px-6 py-3 rounded-lg text-center"
              >
                Sign in
              </Link>
            </div>

            <p className="mt-4 text-sm text-slate-500">
              No credit card required • Free forever plan
            </p>
          </motion.div>

          {/* Preview Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-slate-50 border border-slate-200 rounded-2xl shadow-xl p-6"
          >
            <div className="bg-white rounded-xl shadow p-5 space-y-4">
              <div className="h-4 w-24 bg-slate-200 rounded" />
              <div className="h-3 w-full bg-slate-200 rounded" />
              <div className="h-3 w-5/6 bg-slate-200 rounded" />
              <div className="pt-4 grid grid-cols-3 gap-3">
                <div className="h-16 bg-indigo-100 rounded-lg" />
                <div className="h-16 bg-indigo-100 rounded-lg" />
                <div className="h-16 bg-indigo-100 rounded-lg" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 py-16 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900">
            Why teams choose Syncly
          </h2>

          <div className="mt-12 grid md:grid-cols-3 gap-8">
            <Feature
              title="Smart Calendar Sync"
              desc="Connect Google or Outlook calendars and prevent double bookings automatically."
            />
            <Feature
              title="Instant Booking Links"
              desc="Share one link and let others book available time slots instantly."
            />
            <Feature
              title="Team Scheduling"
              desc="Coordinate across teammates and find the best time for everyone."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-slate-900">
            Ready to simplify your scheduling?
          </h3>
          <p className="mt-4 text-lg text-slate-600">
            Join Syncly today and take control of your time.
          </p>
          <Link
            to="/register"
            className="inline-block mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg"
          >
            Get started for free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Syncly. All rights reserved.
      </footer>
    </div>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <h4 className="font-semibold text-lg text-slate-900">{title}</h4>
      <p className="mt-2 text-slate-600 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
