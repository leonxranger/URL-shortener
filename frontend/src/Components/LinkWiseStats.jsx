import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Link2, Search, ChevronDown, Check, ArrowUpRight,
  MousePointerClick, Users, Globe2, Smartphone, CalendarDays, X,
  Monitor, Tablet, Copy, ExternalLink, Zap, Share2, Activity,
  TrendingUp,
} from "lucide-react";
import { userURls, useLinkwiseStats } from "../hooks/useLinks.js";
import { useUser } from "@clerk/clerk-react";
import { LinkSelector } from "./LinkWiseComponents.jsx";
import { Skeleton } from "./LinkWiseComponents.jsx";
import { linkAccent } from "./LinkWiseComponents.jsx";
import {PAGE_BG,INK,MUTED,SUBTLE,BORDER,NAVY,NAVY_GRAD,SKY_BG,MINT_BG,LAV_BG,ROSE_BG,AMBER_BG,SKY,MINT,LAV,ROSE,AMBER} from '../Util/ColourSettings.js'
import { data } from "react-router";
/* ─── Refined Design Tokens ───────────────Api is up and running──────────────────── */


const heading = { fontFamily: "'Sora', ui-sans-serif, system-ui", letterSpacing: "-0.02em" };
const body = { fontFamily: "'Inter', ui-sans-serif, system-ui" };

/* ─── Accent color per link (deterministic) ─────────────────── */
export const ACCENTS = [
  { accent: ROSE, accentBg: ROSE_BG },
  { accent: SKY,  accentBg: SKY_BG  },
  { accent: LAV,  accentBg: LAV_BG  },
  { accent: MINT, accentBg: MINT_BG },
  { accent: NAVY, accentBg: "#E2E8F0" },
  { accent: AMBER, accentBg: AMBER_BG },
];



/* ─── Device colors & icons ─────────────────────────────────── */
const DEVICE_CONFIG = {
  Desktop: { color: SKY, bg: SKY_BG, icon: Monitor },
  Mobile:  { color: MINT, bg: MINT_BG, icon: Smartphone },
  Tablet:  { color: LAV, bg: LAV_BG, icon: Tablet },
};
function deviceConfig(name) {
  return DEVICE_CONFIG[name] || { color: MUTED, bg: "#F1F5F9", icon: Globe2 };
}

/* ─── Country flags ─────────────────────────────────────────── */
const FLAGS = {
  "United States": "🇺🇸", USA: "🇺🇸", US: "🇺🇸",
  "United Kingdom": "🇬🇧", UK: "🇬🇧", GB: "🇬🇧",
  Germany: "🇩🇪", France: "🇫🇷", India: "🇮🇳", Brazil: "🇧🇷",
  Canada: "🇨🇦", Australia: "🇦🇺", Japan: "🇯🇵", China: "🇨🇳",
  Russia: "🇷🇺", Netherlands: "🇳🇱", Spain: "🇪🇸", Italy: "🇮🇹",
  Mexico: "🇲🇽", Singapore: "🇸🇬", "South Korea": "🇰🇷", Korea: "🇰🇷",
  Sweden: "🇸🇪", Norway: "🇳🇴", Finland: "🇫🇮", Denmark: "🇩🇰",
  Poland: "🇵🇱", Turkey: "🇹🇷", Indonesia: "🇮🇩", Pakistan: "🇵🇰",
  Nigeria: "🇳🇬", Bangladesh: "🇧🇩", Egypt: "🇪🇬", Vietnam: "🇻🇳",
  Argentina: "🇦🇷", Colombia: "🇨🇴", "South Africa": "🇿🇦", Ukraine: "🇺🇦",
  Ireland: "🇮🇪", Portugal: "🇵🇹", Greece: "🇬🇷", Switzerland: "🇨🇭",
  Austria: "🇦🇹", Belgium: "🇧🇪", "Czech Republic": "🇨🇿", Czechia: "🇨🇿",
  Hungary: "🇭🇺", Romania: "🇷🇴", Israel: "🇮🇱", UAE: "🇦🇪",
  "United Arab Emirates": "🇦🇪", "Saudi Arabia": "🇸🇦", Thailand: "🇹🇭",
  Malaysia: "🇲🇾", Philippines: "🇵🇭", "New Zealand": "🇳🇿", NZ: "🇳🇿",
};
function countryFlag(name) { return FLAGS[name] || "🌍"; }

/* ─── Range config ──────────────────────────────────────────── */
const RANGES = [
  { label: "7 Days",  value: "week"  },
  { label: "30 Days", value: "month" },
  { label: "1 Year",  value: "year"  },
];

/* ─── Number formatting ─────────────────────────────────────── */
export function formatNumber(n) {
  if (n == null || isNaN(n)) return "—";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "k";
  return n.toLocaleString();
}



/* ─── Copy Button ───────────────────────────────────────────── */
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all hover:scale-105 active:scale-95"
      style={{ background: "rgba(255,255,255,0.15)", color: "#fff", backdropFilter: "blur(8px)" }}
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

/* ─── StatCard (Premium) ─────────────────────────────────────── */
function StatCard({ icon, label, value, sub, bg, fg, dark, loading, children }) {
  return (
    <div
      className="rounded-[20px] p-5 flex flex-col justify-between min-h-[132px] transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
      style={{
        background: dark ? NAVY_GRAD : bg || "#fff",
        border: dark ? "none" : `1px solid ${BORDER}`,
        boxShadow: dark
          ? "0 8px 32px -8px rgba(30, 41, 59, 0.35)"
          : "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px -4px rgba(0,0,0,0.03)",
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ ...body, color: dark ? "rgba(255,255,255,0.5)" : MUTED }}>
          {label}
        </span>
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: dark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.6)", backdropFilter: "blur(4px)" }}
        >
          {React.cloneElement(icon, { size: 15, color: dark ? "#fff" : fg, strokeWidth: 2.5 })}
        </div>
      </div>
      <div className="mt-2">
        {loading ? (
          <Skeleton className="h-9 w-28 mt-1" />
        ) : (
          <>
            <div className="text-[28px] font-bold leading-none tracking-tight" style={{ ...heading, color: dark ? "#fff" : INK }}>
              {value}
            </div>
            {sub && (
              <div className="text-[12px] mt-1.5 font-medium" style={{ ...body, color: dark ? "rgba(255,255,255,0.45)" : SUBTLE }}>
                {sub}
              </div>
            )}
            {children}
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Mini Sparkline (for stat cards) ───────────────────────── */
function MiniSparkline({ data, color, height = 40 }) {
  if (!data || data.length < 2) return <div style={{ height }} />;
  return (
    <div style={{ height, marginTop: 12 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`spark-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.25} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="clicks" stroke={color} strokeWidth={2} fill={`url(#spark-${color})`} isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ─── Pill ─────────────────────────────────────────────────── */
function Pill({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-3.5 py-1.5 rounded-full text-[12px] font-bold transition-all duration-200 hover:scale-105 active:scale-95"
      style={{
        ...body,
        background: active ? NAVY : "transparent",
        color: active ? "#fff" : MUTED,
        boxShadow: active ? "0 2px 8px -2px rgba(30, 41, 59, 0.25)" : "none"
      }}
    >
      {children}
    </button>
  );
}

/* ─── Gradient Bar Row ─────────────────────────────────────── */
function BarRow({ label, value, max, color, rank, icon }) {
  const pct = Math.max(4, Math.round((value / Math.max(max, 1)) * 100));
  const isTop3 = rank && rank <= 3;
  return (
    <div className="flex items-center gap-3 py-2.5 group transition-colors hover:bg-slate-50 rounded-lg px-2 -mx-2">
      {rank && (
        <span
          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${isTop3 ? "text-white" : "text-slate-400"}`}
          style={{ background: isTop3 ? color : "#F1F5F9" }}
        >
          {rank}
        </span>
      )}
      {icon && <span className="flex-shrink-0 text-[14px]">{icon}</span>}
      <span className="text-[13px] w-[100px] truncate font-medium" style={{ ...body, color: INK }}>{label}</span>
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "#F1F5F9" }}>
        <div className="h-full rounded-full transition-all duration-700 ease-out relative" style={{ width: `${pct}%`, background: color }}>
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
        </div>
      </div>
      <span className="text-[12.5px] font-bold w-12 text-right tabular-nums" style={{ ...body, color: INK }}>{value}</span>
    </div>
  );
}


/* ─── Custom Chart Tooltip ─────────────────────────────────── */
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-4 py-3 shadow-xl border" style={{ background: "rgba(255,255,255,0.98)", borderColor: BORDER, backdropFilter: "blur(8px)" }}>
      <div className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ ...body, color: MUTED }}>{label}</div>
      <div className="text-[15px] font-bold" style={{ ...heading, color: INK }}>
        {payload[0].value.toLocaleString()} <span className="text-[12px] font-medium text-slate-400">clicks</span>
      </div>
    </div>
  );
}

/* ─── Source Chart Tooltip (FIXED: explicit labels) ─────────── */
function SourceTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-4 py-3 shadow-xl border" style={{ background: "rgba(255,255,255,0.98)", borderColor: BORDER, backdropFilter: "blur(8px)" }}>
      <div className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ ...body, color: MUTED }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-6 mb-1 last:mb-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
            <span className="text-[12.5px] font-medium" style={{ ...body, color: MUTED }}>{p.name}</span>
          </div>
          <span className="text-[13px] font-bold tabular-nums" style={{ ...heading, color: INK }}>{p.value?.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Empty State ─────────────────────────────────────────── */
function EmptyState({ icon, title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
        {React.cloneElement(icon, { size: 20, color: MUTED })}
      </div>
      <div className="text-[13px] font-bold" style={{ ...body, color: MUTED }}>{title}</div>
      <div className="text-[12px] mt-0.5" style={{ ...body, color: SUBTLE }}>{subtitle}</div>
    </div>
  );
}

/* ─── Main Dashboard ───────────────────────────────────────── */
export default function LinkWiseStats() {
  const { user } = useUser();
  const { data: links, isLoading: linksLoading } = userURls(user?.id);
  const [selectedId, setSelectedId] = useState(null);
  const [range, setRange] = useState("week");
  const [sourceFilter, setSourceFilter] = useState("All");

  const selected = useMemo(() => {
    if (!links?.length) return null;
    if (selectedId) return links.find(l => l._id === selectedId) ?? links[0];
    return links[0];
  }, [links, selectedId]);

  const { data: analyticsRaw, isLoading: analyticsLoading } = useLinkwiseStats(
    selected?.short_code ?? null,
    range
  );

  const stats = analyticsRaw?.range;
  const linkMeta = analyticsRaw?.link;

  const devices = useMemo(() => {
    if (!stats?.devices) return [];
    return stats.devices.map(d => {
      const cfg = deviceConfig(d.name);
      return { ...d, ...cfg };
    });
  }, [stats?.devices]);

  const maxRef = Math.max(...(stats?.referrers?.map(r => r.clicks) ?? [1]));
  const maxCountry = Math.max(...(stats?.countries?.map(c => c.clicks) ?? [1]));

  const topCountry = stats?.countries?.[0];
  const topDevice = devices[0];
  const peakDay = stats?.timeseries?.length
    ? stats.timeseries.reduce((a, b) => (b.clicks > a.clicks ? b : a), stats.timeseries[0])
    : null;

  const { accent } = selected ? linkAccent(selected.short_code) : ACCENTS[0];

  /* ── FIX: Explicit source series mapping with clear keys ── */
  // Backend returns: [{ label, Direct, Referral }, ...]
  // We normalize to ensure keys are always present and correctly named
  const sourceSeries = useMemo(() => {
    if (!stats?.sourceTimeSeries?.length) return [];
    return stats.sourceTimeSeries.map(pt => ({
      label: pt.label,
      Direct: pt.Direct ?? pt.direct ?? 0,
      Referral: pt.Referral ?? pt.referral ?? 0,
    }));
  }, [stats?.sourceTimeSeries]);

  const totalDirect = sourceSeries.reduce((a, b) => a + b.Direct, 0);
  const totalReferral = sourceSeries.reduce((a, b) => a + b.Referral, 0);
  const totalSourceClicks = totalDirect + totalReferral;

  useEffect(()=>{
    if(!analyticsLoading){
    console.log(analyticsRaw);

    }
  },[analyticsRaw])

  return (
    <div className="w-full min-h-screen p-4 " style={{ background: PAGE_BG, ...body }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');`}</style>

      <div className="max-w-[2000px] mx-auto">

        {/* ── Header ───────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: MINT }} />
              <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: MUTED }}>Analytics</span>
            </div>
            <h1 className="text-[26px] font-extrabold leading-tight" style={{ ...heading, color: INK }}>Link Performance</h1>
            <p className="text-[13px] mt-0.5" style={{ color: MUTED }}>Real-time insights for your shortened URLs</p>
          </div>
          <div className="flex items-center gap-2 rounded-full px-4 py-2.5"
            style={{ background: "#fff", border: `1px solid ${BORDER}`, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <CalendarDays size={14} color={MUTED} strokeWidth={2.5} />
            <span className="text-[12.5px] font-bold" style={{ color: INK }}>
              {range === "week" ? "Last 7 days" : range === "month" ? "Last 30 days" : "Last 365 days"}
            </span>
          </div>
        </div>

        {/* ── Link Hero Card ─────────────────────────────────── */}
        <div className="mb-6">
{         !linksLoading && <LinkSelector
            links={links}
            selected={selected}
            onSelect={l => setSelectedId(l._id)}
            loading={linksLoading}
          />}
        </div>

        {/* Hero actions */}
        {selected && !linksLoading && (
          <div className="flex flex-wrap items-center gap-3 mb-6 -mt-2">
            <CopyButton text={`https://ziplink.io/${selected.short_code}`} />
            <a
              href={selected.longURL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all hover:scale-105 active:scale-95"
              style={{ background: "#fff", color: INK, border: `1px solid ${BORDER}` }}
            >
              <ExternalLink size={13} /> Open destination
            </a>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold" style={{ background: ACCENTS[3].accentBg, color: ACCENTS[3].accent }}>
              <Zap size={13} /> {formatNumber(linkMeta?.totalClicks ?? selected.clicks ?? 0)} total clicks
            </div>
          </div>
        )}

        {/* ── Stat Cards ─────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <StatCard
            dark loading={analyticsLoading}
            icon={<MousePointerClick />}
            label="Total Clicks"
            value={formatNumber(linkMeta?.totalClicks)}
            sub="All-time engagement"
          >
            {!analyticsLoading && stats?.timeseries && (
              <MiniSparkline data={stats.timeseries} color="#fff" />
            )}
          </StatCard>

          <StatCard
            bg={SKY_BG} fg={SKY} loading={analyticsLoading}
            icon={<Users />}
            label="Unique Visitors"
            value={formatNumber(stats?.uniqueVisitors)}
            sub={linkMeta?.totalClicks && stats?.uniqueVisitors != null
              ? `${((stats.uniqueVisitors / linkMeta.totalClicks) * 100).toFixed(1)}% of total clicks`
              : "—"}
          />

          <StatCard
            bg={MINT_BG} fg={MINT} loading={analyticsLoading}
            icon={<Globe2 />}
            label="Top Country"
            value={topCountry?.name ?? "—"}
            sub={topCountry ? `${formatNumber(topCountry.clicks)} clicks` : "No data yet"}
          />

          <StatCard
            bg={LAV_BG} fg={LAV} loading={analyticsLoading}
            icon={<Smartphone />}
            label="Top Device"
            value={topDevice?.name ?? "—"}
            sub={topDevice ? `${formatNumber(topDevice.value)} clicks` : "No data yet"}
          />

          <StatCard
            bg={ROSE_BG} fg={ROSE} loading={analyticsLoading}
            icon={<ArrowUpRight />}
            label="Peak Day"
            value={peakDay?.label ?? "—"}
            sub={peakDay ? `${formatNumber(peakDay.clicks)} clicks` : "No data yet"}
          />
        </div>

        {/* ── Charts Row ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">

          {/* Clicks over time */}
          <div className="rounded-[20px] p-5 lg:p-6" style={{
            background: "#fff",
            border: `1px solid ${BORDER}`,
            boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px -4px rgba(0,0,0,0.03)"
          }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-[15px] font-bold" style={{ ...heading, color: INK }}>Clicks Over Time</h3>
                <p className="text-[12px] mt-0.5" style={{ color: MUTED }}>Daily click volume across selected period</p>
              </div>
              <div className="flex items-center gap-1 rounded-full p-1" style={{ background: PAGE_BG }}>
                {RANGES.map(r => (
                  <Pill key={r.value} active={range === r.value} onClick={() => setRange(r.value)}>
                    {r.label}
                  </Pill>
                ))}
              </div>
            </div>
            <div style={{ height: 260 }}>
              {analyticsLoading ? (
                <Skeleton className="h-full w-full rounded-[12px]" />
              ) : !stats?.timeseries?.length ? (
                <EmptyState icon={<Activity />} title="No activity yet" subtitle="Data will appear once clicks start rolling in" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.timeseries} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={accent} stopOpacity={0.9} />
                        <stop offset="100%" stopColor={accent} stopOpacity={0.6} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke={BORDER} strokeDasharray="4 4" />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: MUTED, fontWeight: 500 }} axisLine={false} tickLine={false} dy={8} />
                    <YAxis tick={{ fontSize: 11, fill: MUTED, fontWeight: 500 }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(1)}k` : v} />
                    <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(241, 245, 249, 0.6)", radius: 6 }} />
                    <Bar dataKey="clicks" radius={[8, 8, 8, 8]} fill="url(#barGradient)" maxBarSize={40} animationDuration={800} animationEasing="ease-out" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Click Sources — FIXED Area Chart with explicit mapping */}
          <div className="rounded-[20px] p-5 lg:p-6" style={{
            background: "#fff",
            border: `1px solid ${BORDER}`,
            boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px -4px rgba(0,0,0,0.03)"
          }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-[15px] font-bold" style={{ ...heading, color: INK }}>Traffic Sources</h3>
                <p className="text-[12px] mt-0.5" style={{ color: MUTED }}>Direct visits vs referred traffic over time</p>
              </div>
              <div className="flex items-center gap-1 rounded-full p-1" style={{ background: PAGE_BG }}>
                {["All", "Direct", "Referral"].map(s => (
                  <Pill key={s} active={sourceFilter === s} onClick={() => setSourceFilter(s)}>{s}</Pill>
                ))}
              </div>
            </div>

            {/* Legend with explicit colors */}
            <div className="flex items-center gap-5 mb-3">
              {(sourceFilter === "All" || sourceFilter === "Direct") && (
                <div className="flex items-center gap-2">
                  <span className="w-3 h-1 rounded-full" style={{ background: NAVY }} />
                  <span className="text-[12px] font-semibold" style={{ ...body, color: MUTED }}>Direct</span>
                </div>
              )}
              {(sourceFilter === "All" || sourceFilter === "Referral") && (
                <div className="flex items-center gap-2">
                  <span className="w-3 h-1 rounded-full" style={{ background: SKY }} />
                  <span className="text-[12px] font-semibold" style={{ ...body, color: MUTED }}>Referral</span>
                </div>
              )}
            </div>

            <div style={{ height: 200 }}>
              {analyticsLoading ? (
                <Skeleton className="h-full w-full rounded-[12px]" />
              ) : sourceSeries.length === 0 ? (
                <EmptyState icon={<Share2 />} title="No source data" subtitle="Traffic source breakdown will appear soon" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sourceSeries} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gDirect" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={NAVY} stopOpacity={0.2} />
                        <stop offset="100%" stopColor={NAVY} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gReferral" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={SKY} stopOpacity={0.2} />
                        <stop offset="100%" stopColor={SKY} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke={BORDER} strokeDasharray="4 4" />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: MUTED, fontWeight: 500 }} axisLine={false} tickLine={false} dy={8} />
                    <YAxis tick={{ fontSize: 11, fill: MUTED, fontWeight: 500 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<SourceTooltip />} />
                    {(sourceFilter === "All" || sourceFilter === "Direct") && (
                      <Area
                        type="monotone"
                        dataKey="Direct"
                        name="Direct"
                        stroke={NAVY}
                        strokeWidth={2.5}
                        fill="url(#gDirect)"
                        dot={false}
                        activeDot={{ r: 4, strokeWidth: 0, fill: NAVY }}
                      />
                    )}
                    {(sourceFilter === "All" || sourceFilter === "Referral") && (
                      <Area
                        type="monotone"
                        dataKey="Referral"
                        name="Referral"
                        stroke={SKY}
                        strokeWidth={2.5}
                        fill="url(#gReferral)"
                        dot={false}
                        activeDot={{ r: 4, strokeWidth: 0, fill: SKY }}
                      />
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Source summary stats */}
            {!analyticsLoading && totalSourceClicks > 0 && (
              <div className="grid grid-cols-2 gap-4 mt-4 pt-4" style={{ borderTop: `1px solid ${BORDER}` }}>
                <div className="text-center">
                  <div className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: MUTED }}>Direct</div>
                  <div className="text-[20px] font-bold" style={{ ...heading, color: INK }}>{formatNumber(totalDirect)}</div>
                  <div className="text-[11px] font-medium" style={{ color: SUBTLE }}>
                    {((totalDirect / totalSourceClicks) * 100).toFixed(1)}% of tracked
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: MUTED }}>Referral</div>
                  <div className="text-[20px] font-bold" style={{ ...heading, color: INK }}>{formatNumber(totalReferral)}</div>
                  <div className="text-[11px] font-medium" style={{ color: SUBTLE }}>
                    {((totalReferral / totalSourceClicks) * 100).toFixed(1)}% of tracked
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Bottom Row ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

          {/* Devices */}
          <div className="rounded-[20px] p-5 lg:p-6" style={{
            background: "#fff",
            border: `1px solid ${BORDER}`,
            boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px -4px rgba(0,0,0,0.03)"
          }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-[15px] font-bold" style={{ ...heading, color: INK }}>Devices</h3>
                <p className="text-[12px] mt-0.5" style={{ color: MUTED }}>Click distribution by device type</p>
              </div>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: PAGE_BG }}>
                <Smartphone size={14} color={MUTED} />
              </div>
            </div>
            {analyticsLoading ? (
              <Skeleton className="h-[140px] w-full rounded-[12px]" />
            ) : devices.length === 0 ? (
              <EmptyState icon={<Smartphone />} title="No device data" subtitle="Device breakdown will appear with clicks" />
            ) : (
              <div className="flex items-center gap-5">
                <div style={{ width: 130, height: 130 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={devices} dataKey="value" innerRadius={40} outerRadius={62} paddingAngle={4} stroke="none" animationDuration={800}>
                        {devices.map((d, i) => <Cell key={i} fill={d.color} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-3">
                  {devices.map(d => {
                    const Icon = d.icon;
                    const total = devices.reduce((a, b) => a + b.value, 0);
                    const pct = total ? ((d.value / total) * 100).toFixed(1) : 0;
                    return (
                      <div key={d.name} className="flex items-center justify-between group">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: d.bg }}>
                            <Icon size={14} color={d.color} strokeWidth={2.5} />
                          </div>
                          <div>
                            <div className="text-[13px] font-bold" style={{ color: INK }}>{d.name}</div>
                            <div className="text-[11px] font-medium" style={{ color: SUBTLE }}>{pct}% of clicks</div>
                          </div>
                        </div>
                        <span className="text-[13px] font-bold tabular-nums" style={{ color: INK }}>{formatNumber(d.value)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Top Referrers */}
          <div className="rounded-[20px] p-5 lg:p-6" style={{
            background: "#fff",
            border: `1px solid ${BORDER}`,
            boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px -4px rgba(0,0,0,0.03)"
          }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-[15px] font-bold" style={{ ...heading, color: INK }}>Top Referrers</h3>
                <p className="text-[12px] mt-0.5" style={{ color: MUTED }}>Where your traffic is coming from</p>
              </div>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: PAGE_BG }}>
                <Share2 size={14} color={MUTED} />
              </div>
            </div>
            {analyticsLoading ? (
              <Skeleton className="h-[140px] w-full rounded-[12px]" />
            ) : (stats?.referrers?.length ?? 0) === 0 ? (
              <EmptyState icon={<Share2 />} title="No referrer data" subtitle="Referrers will be tracked automatically" />
            ) : (
              <div className="space-y-1">
                {stats.referrers.map((r, idx) => (
                  <BarRow
                    key={r.name}
                    rank={idx + 1}
                    label={r.name}
                    value={r.clicks}
                    max={maxRef}
                    color={SKY}
                    icon={<Globe2 size={14} color={MUTED} />}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Top Countries */}
          <div className="rounded-[20px] p-5 lg:p-6" style={{
            background: "#fff",
            border: `1px solid ${BORDER}`,
            boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px -4px rgba(0,0,0,0.03)"
          }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-[15px] font-bold" style={{ ...heading, color: INK }}>Top Countries</h3>
                <p className="text-[12px] mt-0.5" style={{ color: MUTED }}>Geographic distribution of clicks</p>
              </div>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: PAGE_BG }}>
                <Globe2 size={14} color={MUTED} />
              </div>
            </div>
            {analyticsLoading ? (
              <Skeleton className="h-[140px] w-full rounded-[12px]" />
            ) : (stats?.countries?.length ?? 0) === 0 ? (
              <EmptyState icon={<Globe2 />} title="No country data" subtitle="Location data will populate over time" />
            ) : (
              <div className="space-y-1">
                {stats.countries.map((c, idx) => (
                  <BarRow
                    key={c.name}
                    rank={idx + 1}
                    label={c.name}
                    value={c.clicks}
                    max={maxCountry}
                    color={MINT}
                    icon={<span className="text-[16px]">{countryFlag(c.name)}</span>}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}