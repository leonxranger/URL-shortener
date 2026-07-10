import { useState,useRef,useEffect,useMemo } from "react";
import { ACCENTS } from "./LinkWiseStats";
import {PAGE_BG,INK,MUTED,SUBTLE,BORDER,NAVY,NAVY_GRAD,SKY_BG,MINT_BG,LAV_BG,ROSE_BG,AMBER_BG,SKY,MINT,LAV,ROSE,AMBER} from '../Util/ColourSettings.js'
import {
  Link2, Search, ChevronDown, Check, ArrowUpRight,
  MousePointerClick, Users, Globe2, Smartphone, CalendarDays, X,
  Monitor, Tablet, Copy, ExternalLink, Zap, Share2, Activity,
  TrendingUp,
} from "lucide-react";
import { formatNumber } from "./LinkWiseStats";

const heading = { fontFamily: "'Sora', ui-sans-serif, system-ui", letterSpacing: "-0.02em" };
const body = { fontFamily: "'Inter', ui-sans-serif, system-ui" };


export function Skeleton({ className = "", style = {} }) {
  return (
    <div className={`rounded-xl overflow-hidden relative ${className}`} style={{ background: "#E2E8F0", ...style }}>
      <div className="absolute inset-0" style={{
        background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.45) 50%, transparent 100%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.6s infinite"
      }} />
      <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
    </div>
  );
}

export function LinkSelector({ links, selected, onSelect, loading }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = useMemo(() =>
    (links || []).filter(l =>
      l.longURL?.toLowerCase().includes(query.toLowerCase()) ||
      l.short_code?.toLowerCase().includes(query.toLowerCase())
    ),
    [links, query]
  );

  
  const { accent, accentBg } = selected ? linkAccent(selected.short_code) : ACCENTS[0];
  const isActive = selected ? new Date(selected.expiration_date) > new Date() : false;

  if (loading || !selected) {
    return <Skeleton className="h-[80px] w-full rounded-[20px]" />;
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 rounded-[20px] p-4 text-left transition-all duration-200 hover:shadow-md"
        style={{
          background: "#fff",
          border: `1px solid ${BORDER}`,
          boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px -4px rgba(0,0,0,0.03)"
        }}
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm" style={{ background: accentBg }}>
            <Link2 size={20} color={accent} strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <span className="text-[15px] font-bold" style={{ ...heading, color: INK }}>
                ziplink.io/{selected.short_code}
              </span>
              <span
                className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider"
                style={{ ...body, background: isActive ? MINT_BG : ROSE_BG, color: isActive ? MINT : ROSE }}
              >
                {isActive ? "Active" : "Expired"}
              </span>
            </div>
            <div className="text-[12.5px] truncate max-w-[400px] mt-0.5" style={{ ...body, color: MUTED }}>
              {selected.longURL}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-[12px] font-medium hidden sm:inline" style={{ ...body, color: SUBTLE }}>{links?.length} links</span>
          <div className="w-9 h-9 rounded-full flex items-center justify-center transition-colors" style={{ background: PAGE_BG }}>
            <ChevronDown
              size={16} color={INK}
              style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s cubic-bezier(0.4, 0, 0.2, 1)" }}
            />
          </div>
        </div>
      </button>

      {open && (
        <div
          className="absolute left-0 right-0 mt-2 rounded-[20px] z-30 overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.98)",
            border: `1px solid ${BORDER}`,
            boxShadow: "0 24px 48px -12px rgba(0, 0, 0, 0.15)",
            backdropFilter: "blur(12px)"
          }}
        >
          <div className="p-3" style={{ borderBottom: `1px solid ${BORDER}` }}>
            <div className="flex items-center gap-2 rounded-full px-3.5 py-2.5" style={{ background: PAGE_BG }}>
              <Search size={15} color={MUTED} />
              <input
                autoFocus
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search links by URL or short code…"
                className="bg-transparent outline-none flex-1 text-[13.5px]"
                style={{ ...body, color: INK }}
              />
              {query && (
                <button onClick={() => setQuery("")} className="hover:bg-slate-200 rounded-full p-0.5 transition-colors">
                  <X size={14} color={MUTED} />
                </button>
              )}
            </div>
          </div>

          <div className="max-h-[320px] overflow-y-auto py-1.5">
            {filtered.length === 0 && (
              <div className="px-5 py-8 text-center">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-2">
                  <Search size={18} color={MUTED} />
                </div>
                <div className="text-[13px] font-medium" style={{ ...body, color: MUTED }}>No links found</div>
                <div className="text-[12px] mt-0.5" style={{ ...body, color: SUBTLE }}>Try a different search term</div>
              </div>
            )}
            {filtered.map((l) => {
              const isSel = l._id === selected._id;
              const { accent: la, accentBg: lab } = linkAccent(l.short_code);
              return (
                <button
                  key={l._id}
                  onClick={() => { onSelect(l); setOpen(false); setQuery(""); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
                  style={{ background: isSel ? "#F8FAFC" : "transparent" }}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: lab }}>
                    <Link2 size={14} color={la} strokeWidth={2.5} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-bold" style={{ ...body, color: INK }}>
                      ziplink.io/{l.short_code}
                    </div>
                    <div className="text-[12px] truncate max-w-[320px]" style={{ ...body, color: MUTED }}>
                      {l.longURL}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-[11px] font-bold px-2 py-1 rounded-lg" style={{ ...body, background: PAGE_BG, color: MUTED }}>
                      {formatNumber(l.clicks)} clicks
                    </span>
                    {isSel && (
                      <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                        <Check size={14} color={MINT} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function linkAccent(short_code) {
  let hash = 0;
  for (let i = 0; i < short_code?.length; i++) {
    hash = (hash * 31 + short_code.charCodeAt(i)) & 0xffffffff;
  }
  return ACCENTS[Math.abs(hash) % ACCENTS.length];
}