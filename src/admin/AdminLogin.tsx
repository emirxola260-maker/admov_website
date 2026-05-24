import * as React from "react";
import { motion } from "motion/react";
import { ArrowRight, Lock } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface AdminLoginProps {
  onLogin: () => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!supabase) {
      setError("Authentication is not configured. Please contact the administrator.");
      setLoading(false);
      return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError("Invalid email or password. Please try again.");
    } else {
      onLogin();
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center selection:bg-[#b6acff]"
      style={{ fontFamily: "'Manrope', sans-serif", backgroundColor: "#FCF9F8" }}
    >
      {/* Background Accents */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#5749C2]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-[#5D54A0]/5 rounded-full blur-[100px]" />
      </div>

      {/* Decorative Labels */}
      <div className="fixed top-12 left-12 opacity-20 hidden lg:block">
        <div className="w-24 h-[1px] bg-[#1B1C1C] mb-2" />
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#1B1C1C]" style={{ fontFamily: '"Syne", sans-serif' }}>
          Institutional Access
        </span>
      </div>
      <div className="fixed bottom-12 right-12 opacity-20 hidden lg:block text-right">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#1B1C1C] mb-2 block" style={{ fontFamily: '"Syne", sans-serif' }}>
          System Integrity
        </span>
        <div className="w-24 h-[1px] bg-[#1B1C1C] ml-auto" />
      </div>

      {/* Login Container */}
      <motion.main
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
        className="relative z-10 w-full max-w-[440px] px-6"
      >
        {/* Logo */}
        <div className="flex justify-center mb-12">
          <span
            className="text-3xl font-black uppercase tracking-tighter text-[#1B1C1C]"
            style={{ fontFamily: '"Syne", sans-serif' }}
          >
            ADMOV
          </span>
        </div>

        {/* Auth Card */}
        <section className="bg-white rounded-[20px] shadow-[0px_20px_40px_rgba(27,28,28,0.06)] border border-[#c8c4d5]/30 overflow-hidden">
          <div className="p-10">
            <div className="mb-8">
              <h1
                className="text-[28px] font-extrabold tracking-tight text-[#1B1C1C] leading-tight mb-2"
                style={{ fontFamily: '"Syne", sans-serif' }}
              >
                Admin Panel
              </h1>
              <p className="text-[#474553] font-light text-sm">
                Enter your credentials to continue
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  className="block text-[11px] uppercase tracking-wider font-semibold text-[#474553]/70 ml-1"
                  htmlFor="admin-email"
                >
                  Email
                </label>
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder="you@admov.io"
                  className="w-full bg-[#F6F3F2] border-none rounded-xl py-4 px-5 text-[#1B1C1C] placeholder:text-[#474553]/40 focus:ring-2 focus:ring-[#5749C2]/20 transition-all duration-300 outline-none text-sm"
                  required
                />
              </div>
              <div className="space-y-2">
                <label
                  className="block text-[11px] uppercase tracking-wider font-semibold text-[#474553]/70 ml-1"
                  htmlFor="admin-password"
                >
                  Password
                </label>
                <div className="relative group">
                  <input
                    id="admin-password"
                    type="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    placeholder="Password"
                    className="w-full bg-[#F6F3F2] border-none rounded-xl py-4 px-5 text-[#1B1C1C] placeholder:text-[#474553]/40 focus:ring-2 focus:ring-[#5749C2]/20 transition-all duration-300 outline-none text-sm"
                    required
                  />
                  <div className="absolute inset-y-0 right-4 flex items-center opacity-40 group-focus-within:text-[#5749C2] group-focus-within:opacity-100 transition-all">
                    <Lock size={20} />
                  </div>
                </div>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[#ba1a1a] text-sm font-medium"
                >
                  {error}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1B1C1C] text-[#FCF9F8] py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#1B1C1C]/90 active:scale-[0.98] transition-all duration-300 shadow-xl shadow-[#1B1C1C]/5 disabled:opacity-60 text-sm"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  <>
                    <span>Enter Dashboard</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer strip */}
          <div className="bg-[#F6F3F2] px-10 py-5 flex justify-between items-center">
            <span className="text-[12px] font-medium text-[#474553] flex items-center gap-1 cursor-default">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              Forgot Password?
            </span>
            <span className="text-[10px] text-[#474553]/50 uppercase tracking-widest font-bold">
              Encrypted Session
            </span>
          </div>
        </section>

        {/* Copyright */}
        <footer className="mt-8 text-center">
          <p className="text-[11px] text-[#474553]/60 font-medium">
            &copy; {new Date().getFullYear()} ADMOV. All rights reserved.
          </p>
        </footer>
      </motion.main>
    </div>
  );
}
