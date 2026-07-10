import React, { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { APICheck, useAccountOverview } from '../hooks/useLinks.js';
import ActiveLinks from '../Components/ActiveLinks.jsx';
import AccountStats from '../Components/AccountStats.jsx';
import Loading from '../Components/Loading.jsx';
import Graph from '../Components/Graph.jsx';
import { useLinkwiseStats } from '../hooks/useLinks.js';
import { BarChart2, ArrowUpRight } from 'lucide-react';

const AnalyticsDashboard = () => {
    const { user } = useUser();
    const { data, isPending } = useAccountOverview(user?.id);

    if (isPending) {
        return <div className="flex items-center justify-center h-full w-full"><Loading /></div>;
    }

    return (
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


        </div>
    );
};

export default AnalyticsDashboard;