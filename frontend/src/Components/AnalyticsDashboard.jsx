    import React, { useEffect, useState } from 'react';
    import { useUser } from '@clerk/clerk-react';
    import { APICheck, useAccountOverview } from '../hooks/useLinks.js';
    import ActiveLinks from '../Components/ActiveLinks.jsx';
    import AccountStats from '../Components/AccountStats.jsx';
    import Loading from '../Components/Loading.jsx';
    import Graph from '../Components/Graph.jsx';
    import { useLinkwiseStats } from '../hooks/useLinks.js';
    import { BarChart2, ArrowUpRight } from 'lucide-react';
    import RecentLinks from './RecentLinks.jsx';
    const Range = ["7 days","30 days","1 Year"]


    const RangeBox=({setTime,Time,range })=>{
        const handelSelect=(idx)=>{
            setTime(idx);
        }   


        
    
        return(
        <div className='h-[45px] rounded-full flex flex-row text-xs  items-center justify-center w-[100px] md:w-[190px] bg-zinc-300/50'>
            {range.map((time,idx)=>(
                <div onClick={()=>{handelSelect(idx)}} className='h-full  items-center hover:cursor-pointer hover:opacity-80 hover:rounded-full hover:bg-zinc-300/80  justify-center flex flex-row w-full'>
                    <div className={`rounded-full ${idx==Time?`bg-black text-white rounded-full`:'bg-'} p-2`}
                        style={{
                            transform:`translateX(calc(${time * 100}% + ${time * 4}px))`,
                            transition:'ease-in-out ',
                            transitionDuration:'0.2s'
                        }}>
                    <h1>{time}</h1>
                    </div>
                </div>
            ))}
        </div>)
    }

    const AnalyticsDashboard = () => {
        const { user } = useUser();
        const { data, isPending } = useAccountOverview(user?.id);
        const [Time , setTime] = useState(0);


        if (isPending) {
            return <div className="flex items-center justify-center h-full w-full"><Loading /></div>;
        }

        return (
            <div className="flex flex-col gap-6 max-w-[1400px] mx-auto">
                <div className="w-full">
                    <AccountStats links={data?.links} clicks={data?.clicks} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
                    <div className="lg:col-span-2  bg-white rounded-[24px] p-6 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.02)]  border-slate-50">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-[15px] font-semibold text-slate-800">Traffic Overview</h2>
                            <div className='flex flex-row gap-2 '>
                                <RangeBox range={Range} Time={Time} setTime={setTime} />
                                <button className="p-2 bg-slate-50 rounded-xl text-slate-500 hover:text-slate-900 transition">
                                    <ArrowUpRight className="w-4 h-4" />
                                </button>
                            </div>

                        </div>
                        <div className="h-[380px]  w-full">
                            <Graph CLicks={data?.clicks} Range={Range[Time]} />
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

                <div>
                    <RecentLinks Links = {data?.links}/>
                </div>
            </div>
        );
    };

    export default AnalyticsDashboard;