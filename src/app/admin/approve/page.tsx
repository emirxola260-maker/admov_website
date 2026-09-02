import type { Metadata } from "next";
import { getPostForApproval } from "@/lib/blog/pipeline";
import { Logo } from "@/components/ui/Logo";
import { ApprovePreview } from "./ApprovePreview";

export const metadata: Metadata = { title: "Approve post", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const buttonBase =
  "px-5 py-2.5 rounded-full font-syne font-bold text-sm transition-all hover:scale-105 active:scale-95 backdrop-blur-xl border";

export default async function ApprovePage({ searchParams }: { searchParams: Promise<{ id?: string; token?: string }> }) {
  const { id = "", token = "" } = await searchParams;
  const result = await getPostForApproval(id, token);

  if (!result) {
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-50 flex items-center justify-center px-6 text-center">
        <div className="max-w-md">
          <span className="section-label mx-auto">Approval link</span>
          <h1 className="text-3xl md:text-4xl mb-4">This link is invalid or has already been used</h1>
          <p className="text-zinc-400">Open the admin panel to review drafts instead.</p>
        </div>
      </main>
    );
  }

  const { post, valid } = result;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <div className="fixed top-0 inset-x-0 z-50 bg-zinc-950/90 backdrop-blur-sm border-b border-violet/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Logo />
            <span className="hidden sm:inline text-xs uppercase tracking-widest text-zinc-500">Draft review</span>
          </div>
          {valid ? (
            <form method="post" action="/api/blog/approve" className="flex items-center gap-2">
              <input type="hidden" name="id" value={post.id} />
              <input type="hidden" name="token" value={token} />
              <button
                name="action"
                value="reject"
                className={`${buttonBase} text-zinc-200 border-white/20`}
                style={{ backgroundImage: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)" }}
              >
                Reject
              </button>
              <button
                name="action"
                value="approve"
                className={`${buttonBase} text-white border-violet/30`}
                style={{
                  backgroundImage: "linear-gradient(135deg, rgba(139, 125, 240, 0.6) 0%, rgba(115, 103, 240, 0.4) 100%)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25), 0 4px 15px rgba(139, 125, 240, 0.3)",
                }}
              >
                Approve &amp; publish
              </button>
            </form>
          ) : (
            <span className="text-sm text-zinc-400">
              Status: <b className="text-zinc-200">{post.status}</b>
            </span>
          )}
        </div>
      </div>
      <main className="pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          <ApprovePreview post={post} />
        </div>
      </main>
    </div>
  );
}
