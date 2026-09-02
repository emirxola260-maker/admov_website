"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { AdminLogin } from "./AdminLogin";
import { AdminDashboard } from "./AdminDashboard";

type AuthStatus = "loading" | "in" | "out";

export function AdminPage() {
  const [status, setStatus] = React.useState<AuthStatus>("loading");

  React.useEffect(() => {
    if (!supabase) {
      setStatus("out");
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setStatus(data.session ? "in" : "out");
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setStatus(session ? "in" : "out");
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#FCF9F8" }}>
        <Loader2 size={40} className="animate-spin text-[#5749C2]" />
      </div>
    );
  }

  if (status === "out") {
    return <AdminLogin onLogin={() => setStatus("in")} />;
  }

  return (
    <AdminDashboard
      onLogout={async () => {
        if (supabase) await supabase.auth.signOut();
        setStatus("out");
      }}
    />
  );
}
