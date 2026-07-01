import React, { useEffect } from 'react';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';
import { NavLink } from 'react-router-dom';
import { Search, Bell, Home, Link2, BarChart2, Users, Settings, LogOut, ArrowUpRight, Menu } from 'lucide-react';
import { APICheck, useAccountOverview } from '../hooks/useLinks.js';
import ActiveLinks from '../Components/ActiveLinks.jsx';
import AccountStats from '../Components/AccountStats.jsx';
import Loading from '../Components/Loading.jsx';
import Graph from '../Components/Graph.jsx';

const NAV_ITEMS = [
    { to: '/dashboard', label: 'Dashboard', icon: Home },
    { to: '/links', label: 'Links', icon: Link2 },
    { to: '/analytics', label: 'Analytics', icon: BarChart2 },
    { to: '/audience', label: 'Audience', icon: Users },
    { to: '/settings', label: 'Settings', icon: Settings },
];

const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition ${
        isActive
            ? 'bg-slate-100 text-slate-900 font-semibold'
            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
    }`;

const SidebarContent = ({ onNavigate, signOut }) => (
    <>
        <div>
            <div className="flex items-center gap-2 px-4 mb-8">
                <span className="text-2xl font-extrabold tracking-tight">ZipLink</span>
            </div>
            <nav className="flex flex-col gap-1.5">
                {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
                    <NavLink key={to} to={to} className={navLinkClass} onClick={onNavigate}>
                        <Icon className="w-4 h-4" /> {label}
                    </NavLink>
                ))}
            </nav>
        </div>

        <div className="px-2">
            <div className="bg-slate-900 text-white p-5 rounded-[20px] mb-4 shadow-lg shadow-slate-900/20">
                <h4 className="font-semibold text-sm mb-1">Upgrade To Pro</h4>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">Get access to additional features and analytics.</p>
                <button className="w-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold py-2.5 rounded-xl transition-colors">
                    Upgrade
                </button>
            </div>
            <button
                onClick={() => signOut()}
                className="flex w-full items-center gap-3 px-2 py-2 text-slate-500 text-sm font-medium hover:text-slate-900 transition-colors"
            >
                <LogOut className="w-4 h-4" /> Log out
            </button>
        </div>
    </>
);

const AnalyticsDashboard = () => {
    const { signOut } = useClerk();
    const { user } = useUser();
    const { data, isPending } = useAccountOverview(user?.id);

    const api_health = APICheck();

    useEffect(() => {
        console.log("API-status: ", api_health);
    }, [api_health]);

    return (
        <div className="drawer lg:drawer-open">
            <input id="ziplink-drawer" type="checkbox" className="drawer-toggle" />

            <div className="drawer-content flex flex-col h-screen bg-[#F3F4F6] font-sans text-slate-900 overflow-hidden">

                {/* MOBILE TOP NAVBAR — only visible below lg */}
                <div className="navbar bg-white border-b border-slate-100 lg:hidden px-4">
                    <div className="flex-none">
                        <label htmlFor="ziplink-drawer" className="btn btn-square btn-ghost">
                            <Menu className="w-5 h-5" />
                        </label>
                    </div>
                    <div className="flex-1">
                        <span className="text-xl font-extrabold tracking-tight px-2">ZipLink</span>
                    </div>
                    <div className="flex-none">
                        <UserButton afterSignOutUrl="/" appearance={{ elements: { userButtonAvatarBox: "w-8 h-8" } }} />
                    </div>
                </div>

                {/* MAIN CONTENT AREA */}
                <main className="flex-1 flex flex-col h-full overflow-hidden relative">

                    {/* TOP HEADER (desktop) */}
                    <header className="hidden lg:flex items-center justify-between px-8 py-6">
                        <h1 className="text-2xl font-medium text-slate-800">Dashboard</h1>

                        <div className="flex items-center gap-4">
                            <div className="relative hidden sm:block">
                                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="pl-10 pr-4 py-2.5 bg-white rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-200 w-64 shadow-sm border border-slate-100 placeholder:text-slate-400"
                                />
                            </div>
                            <button className="p-2.5 bg-white rounded-full shadow-sm border border-slate-100 text-slate-500 hover:text-slate-900 transition">
                                <Bell className="w-4 h-4" />
                            </button>
                            <div className="flex items-center gap-3 bg-white p-1 pr-4 rounded-full shadow-sm border border-slate-100">
                                <UserButton afterSignOutUrl="/" appearance={{ elements: { userButtonAvatarBox: "w-8 h-8" } }} />
                                <span className="text-sm font-semibold text-slate-700 hidden sm:block">
                                    {user?.firstName || "User"}
                                </span>
                            </div>
                        </div>
                    </header>

                    {/* MOBILE SEARCH ROW — search bar moves under the navbar on small screens */}
                    <div className="lg:hidden px-4 pt-4">
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-10 pr-4 py-2.5 bg-white rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-200 w-full shadow-sm border border-slate-100 placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    {/* DASHBOARD CONTENT SCROLL AREA */}
                    <div className="flex-1 overflow-y-auto px-4 lg:px-8 pb-10 pt-4 lg:pt-0">
                        {isPending ? (
                            <div className="flex items-center justify-center h-full w-full"><Loading /></div>
                        ) : (
                            <div className="flex flex-col gap-6 max-w-[1400px] mx-auto">

                                <div className="w-full">
                                    <AccountStats links={data?.links} clicks={data?.clicks} />
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div className="lg:col-span-2 bg-white rounded-[24px] p-6 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.02)] border border-slate-50">
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-[15px] font-semibold text-slate-800">Traffic Overview</h2>
                                            <button className="p-2 bg-slate-50 rounded-xl text-slate-500 hover:text-slate-900 transition">
                                                <ArrowUpRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="h-[380px] w-full">
                                            <Graph CLicks={data?.clicks} />
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-[24px] p-6 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.02)] border border-slate-50 flex flex-col">
                                        <h2 className="text-[15px] font-semibold text-slate-800 mb-4">Quick Actions</h2>
                                        <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200 p-6 text-center gap-3">
                                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-400 mb-2">
                                                <BarChart2 className="w-5 h-5" />
                                            </div>
                                            <h3 className="text-sm font-semibold text-slate-800">Ready to track?</h3>
                                            <p className="text-xs text-slate-500 mb-2">Generate a new short link to monitor your campaigns.</p>
                                            <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 transition shadow-md shadow-slate-900/10">
                                                Create Link
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-[24px] p-6 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.02)] border border-slate-50">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-[15px] font-semibold text-slate-800">Active Links</h2>
                                        <button className="p-2 bg-slate-50 rounded-xl text-slate-500 hover:text-slate-900 transition">
                                            <ArrowUpRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="w-full">
                                        <ActiveLinks ActiveLinks={data?.links} isLoading={isPending} />
                                    </div>
                                </div>

                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* DRAWER SIDE — sidebar on desktop, slide-out on mobile */}
            <div className="drawer-side z-20">
                <label htmlFor="ziplink-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <aside className="menu p-4 w-64 min-h-full bg-white text-slate-900 border-r border-slate-100 flex flex-col justify-between">
                    <SidebarContent onNavigate={() => document.getElementById('ziplink-drawer').checked = false} signOut={signOut} />
                </aside>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;