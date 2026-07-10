import React, { useEffect, useMemo } from "react";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { Outlet, useLocation } from "react-router-dom";
import { SidebarContent } from "../Components/Sidebar.jsx";
import { Search, Bell, Menu, Zap } from "lucide-react";

/* ─── Design tokens (synced with analytics page) ──────────── */
const PAGE_BG = "#F1F5F9";
const INK = "#0F172A";
const MUTED = "#64748B";
const SUBTLE = "#94A3B8";
const BORDER = "#E2E8F0";
const NAVY = "#1E293B";

const heading = { fontFamily: "'Sora', ui-sans-serif, system-ui", letterSpacing: "-0.02em" };
const body = { fontFamily: "'Inter', ui-sans-serif, system-ui" };

/* ─── Route → Title map ─────────────────────────────────────── */
const TITLES = {
  "/dashboard": "Overview",
  "/links": "My Links",
  "/analytics": "Link Analytics",
  "/settings": "Settings",
};

function pageTitle(pathname) {
  // exact match first
  if (TITLES[pathname]) return TITLES[pathname];
  // fallback: strip trailing slash and retry
  const clean = pathname.replace(/\/$/, "");
  return TITLES[clean] || "Dashboard";
}

const DashboardLayout = () => {
  const { signOut } = useClerk();
  const { user } = useUser();
  const location = useLocation();

  const title = useMemo(() => pageTitle(location.pathname), [location.pathname]);

  /* Close mobile drawer automatically on route change */
  useEffect(() => {
    const drawer = document.getElementById("ziplink-drawer");
    if (drawer && drawer.checked) drawer.checked = false;
  }, [location.pathname]);

  return (
    <div className="drawer lg:drawer-open">
      <input id="ziplink-drawer" type="checkbox" className="drawer-toggle" />

      {/* ── Main Content Area ───────────────────────────────── */}
      <div
        className="drawer-content flex flex-col h-screen overflow-hidden"
        style={{ background: PAGE_BG, ...body, color: INK }}
      >
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');`}</style>

        {/* MOBILE TOP NAVBAR */}
        <div
          className="navbar lg:hidden px-4 py-3 flex items-center justify-between"
          style={{
            background: "rgba(255,255,255,0.92)",
            borderBottom: `1px solid ${BORDER}`,
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="flex items-center gap-3">
            <label
              htmlFor="ziplink-drawer"
              className="btn btn-ghost btn-square btn-sm rounded-xl"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" style={{ color: INK }} />
            </label>
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: "#E0F2FE" }}
              >
                <Zap size={15} color="#0284C7" strokeWidth={2.5} />
              </div>
              <span className="text-lg font-extrabold tracking-tight" style={{ ...heading, color: INK }}>
                ZipLink
              </span>
            </div>
          </div>
          <UserButton
            afterSignOutUrl="/"
            appearance={{ elements: { userButtonAvatarBox: "w-8 h-8" } }}
          />
        </div>

        <main className="flex-1 flex flex-col h-full overflow-hidden relative">
          {/* DESKTOP HEADER */}
          <header className="hidden lg:flex items-center justify-between px-8 py-5">
            <div>
              <h1
                className="text-[22px] font-bold leading-tight"
                style={{ ...heading, color: INK }}
              >
                {title}
              </h1>
              <p className="text-[12.5px] mt-0.5 font-medium" style={{ color: MUTED }}>
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative hidden sm:block group">
                <Search
                  className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: SUBTLE }}
                />
                <input
                  type="text"
                  placeholder="Search links..."
                  className="pl-10 pr-4 py-2.5 rounded-full text-[13px] font-medium w-64 transition-all outline-none"
                  style={{
                    background: "#fff",
                    border: `1px solid ${BORDER}`,
                    color: INK,
                    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#CBD5E1";
                    e.target.style.boxShadow = "0 0 0 3px rgba(30, 41, 59, 0.08)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = BORDER;
                    e.target.style.boxShadow = "0 1px 2px rgba(0,0,0,0.04)";
                  }}
                />
              </div>

              {/* Notifications */}
              <button
                className="relative p-2.5 rounded-full transition-all hover:scale-105 active:scale-95"
                style={{
                  background: "#fff",
                  border: `1px solid ${BORDER}`,
                  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                  color: MUTED,
                }}
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {/* Unread badge */}
                <span
                  className="absolute top-2 right-2.5 w-2 h-2 rounded-full border-2 border-white"
                  style={{ background: "#E11D48" }}
                />
              </button>

              {/* User Pill */}
              <div
                className="flex items-center gap-2.5 pl-1 pr-4 py-1 rounded-full transition-all hover:shadow-md cursor-pointer"
                style={{
                  background: "#fff",
                  border: `1px solid ${BORDER}`,
                  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                }}
              >
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{ elements: { userButtonAvatarBox: "w-8 h-8" } }}
                />
                <span className="text-[13px] font-semibold hidden sm:block" style={{ color: INK }}>
                  {user?.firstName || user?.username || "User"}
                </span>
              </div>
            </div>
          </header>

          {/* MOBILE SEARCH ROW */}
          <div className="lg:hidden px-4 pt-3 pb-1">
            <div className="relative">
              <Search
                className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2"
                style={{ color: SUBTLE }}
              />
              <input
                type="text"
                placeholder="Search links..."
                className="pl-10 pr-4 py-2.5 rounded-full text-[13px] font-medium w-full outline-none"
                style={{
                  background: "#fff",
                  border: `1px solid ${BORDER}`,
                  color: INK,
                  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#CBD5E1";
                  e.target.style.boxShadow = "0 0 0 3px rgba(30, 41, 59, 0.08)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = BORDER;
                  e.target.style.boxShadow = "0 1px 2px rgba(0,0,0,0.04)";
                }}
              />
            </div>
          </div>

          {/* PAGE INJECTION */}
          <div className="flex-1 overflow-y-auto px-4 lg:px-8 pb-10 pt-3 lg:pt-2">
            <Outlet />
          </div>
        </main>
      </div>

      {/* ── Drawer Sidebar ──────────────────────────────────── */}
      <div className="drawer-side z-30">
        <label
          htmlFor="ziplink-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
          style={{ background: "rgba(15, 23, 42, 0.35)", backdropFilter: "blur(4px)" }}
        />
        <aside
          className="menu w-72 min-h-full flex flex-col justify-between"
          style={{
            background: "rgba(255,255,255,0.98)",
            borderRight: `1px solid ${BORDER}`,
            backdropFilter: "blur(12px)",
          }}
        >
          <SidebarContent
            onNavigate={() => {
              const drawer = document.getElementById("ziplink-drawer");
              if (drawer) drawer.checked = false;
            }}
            signOut={signOut}
          />
        </aside>
      </div>
    </div>
  );
};

export default DashboardLayout;