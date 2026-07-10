import { Search, Bell, Home, Link2, BarChart2, Users, Settings, LogOut, ArrowUpRight, Menu } from 'lucide-react';
import { NavLink } from 'react-router-dom';

 const NAV_ITEMS = [
    { to: '/dashboard', label: 'Dashboard', icon: Home },
    { to: '/links', label: 'Links', icon: Link2 },
    { to: '/analytics', label: 'Analytics', icon: BarChart2 },
];

const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition ${
        isActive
            ? 'bg-slate-100 text-slate-900 font-semibold'
            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
    }`;


export const SidebarContent = ({ onNavigate, signOut }) => (
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