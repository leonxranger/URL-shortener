import React from 'react';
import { Globe2, Sparkles, Smartphone, Monitor, Tablet } from 'lucide-react';

// ---------------------------------------------------------------------------
// FILLER DATA — replace with the output of your country/device facet
// aggregation once the account-wide pipeline exists.
// ---------------------------------------------------------------------------
const FILLER_COUNTRIES = [
    { name: 'India', flag: '🇮🇳', pct: 58 },
    { name: 'United States', flag: '🇺🇸', pct: 27 },
    { name: 'Germany', flag: '🇩🇪', pct: 9 },
    { name: 'Other', flag: '🌐', pct: 6 },
];

const FILLER_DEVICES = [
    { name: 'Mobile', pct: 51, icon: Smartphone },
    { name: 'Desktop', pct: 42, icon: Monitor },
    { name: 'Tablet', pct: 7, icon: Tablet },
];

const NewBadge = () => (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">
        <Sparkles className="w-3 h-3" />
        New
    </span>
);

const CardShell = ({ children, className = '' }) => (
    <div
        className={`bg-white rounded-[24px] p-6 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.02)] border border-slate-50 ${className}`}
    >
        {children}
    </div>
);

const AudienceLocation = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Countries */}
            <CardShell>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2.5">
                        <Globe2 className="w-4 h-4 text-slate-500" />
                        <h2 className="text-[15px] font-semibold text-slate-800">Top Countries</h2>
                        <NewBadge />
                    </div>
                    <span className="text-xs text-slate-400">Sample data</span>
                </div>

                <div className="flex flex-col gap-4">
                    {FILLER_COUNTRIES.map((c) => (
                        <div key={c.name} className="flex items-center gap-3">
                            <span className="text-base">{c.flag}</span>
                            <span className="text-sm text-slate-700 w-32 shrink-0 truncate">{c.name}</span>
                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-orange-400 rounded-full"
                                    style={{ width: `${c.pct}%` }}
                                />
                            </div>
                            <span className="text-xs text-slate-400 w-9 text-right">{c.pct}%</span>
                        </div>
                    ))}
                </div>
            </CardShell>

            {/* Device Split */}
            <CardShell>
                <div className="flex items-center gap-2.5 mb-6">
                    <Monitor className="w-4 h-4 text-slate-500" />
                    <h2 className="text-[15px] font-semibold text-slate-800">Device Split</h2>
                    <NewBadge />
                </div>
                <div className="flex flex-col gap-3">
                    {FILLER_DEVICES.map(({ name, pct, icon: Icon }) => (
                        <div
                            key={name}
                            className="flex items-center gap-4 bg-slate-50/60 rounded-xl px-4 py-3.5"
                        >
                            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-slate-500 shadow-sm">
                                <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm text-slate-700">{name}</span>
                                    <span
                                        className="text-sm font-semibold text-slate-800"
                                        style={{ fontFamily: '"Space Grotesk", sans-serif' }}
                                    >
                                        {pct}%
                                    </span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-orange-400 rounded-full"
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardShell>
        </div>
    );
};

export default AudienceLocation;