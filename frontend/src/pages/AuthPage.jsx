import React, { useEffect, useState } from 'react'
import { Eye, EyeClosed, Star } from 'lucide-react'
import SignUp from '../Components/SignUp.jsx'
import Login from '../Components/Login.jsx'
import { useAuth } from '@clerk/clerk-react'
import { useNavigate } from 'react-router'
const reviews = [
  { name: 'Arjun Mehta', handle: '@arjunm', text: 'Brevio cut our campaign links from 120 chars to 14. Analytics dashboard is insane.', stars: 5 },
  { name: 'Priya Nair', handle: '@priyan', text: 'The real-time click map alone is worth it. Saw exactly where our traffic was coming from.', stars: 5 },
  { name: 'Rohan Das', handle: '@rohand', text: 'Set up in 2 minutes. No bloat, no nonsense. Finally a URL shortener that respects devs.', stars: 5 },
  { name: 'Sneha Rao', handle: '@snehar', text: 'Referral source tracking helped us kill 3 underperforming ad channels immediately.', stars: 4 },
  { name: 'Karan Bose', handle: '@karanb', text: 'Migrated from Bitly in an afternoon. Night and day difference in the analytics.', stars: 5 },
  { name: 'Divya Iyer', handle: '@divyai', text: 'Custom slugs + QR codes + analytics. Everything we needed in one place.', stars: 5 },
  { name: 'Ankit Sharma', handle: '@ankits', text: 'Redirect speed is genuinely 12ms. Benchmarked it myself. Unreal.', stars: 5 },
  { name: 'Meera Pillai', handle: '@meerap', text: 'The location heatmap changed how we target our newsletter subscribers.', stars: 4 },
]

const ReviewCard = ({ name, handle, text, stars }) => (
  <div className="bg-white border border-[#e8e8e8] rounded-xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.06)] w-[230px] shrink-0">
    <div className="flex gap-0.5 mb-2.5">
      {Array.from({ length: stars }).map((_, i) => (
        <Star key={i} size={12} className="fill-[#f59e0b] text-[#f59e0b]" />
      ))}
    </div>
    <p className="text-[#333] text-xs leading-relaxed mb-3">"{text}"</p>
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#c0392b] to-[#e05540] flex items-center justify-center text-white text-[9px] font-bold shrink-0">
        {name[0]}
      </div>
      <div>
        <p className="text-[#111] text-xs font-semibold leading-none">{name}</p>
        <p className="text-[#bbb] text-[10px] mt-0.5">{handle}</p>
      </div>
    </div>
  </div>
)

const AuthPage = () => {


  const row1 = reviews.slice(0, 4)
  const row2 = reviews.slice(4, 8)
  const [mode ,setmode ] = useState('Sign-up');
  const Navigate = useNavigate();
  const {isSignedIn} = useAuth();

  useEffect(()=>{
    if(isSignedIn)Navigate('/dashboard')
  },[isSignedIn]);
  return (
    <>
      <style>{`
        @keyframes drift-a {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(-30px, -40px) scale(1.12); }
        }
        @keyframes drift-b {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(40px, 25px) scale(0.9); }
        }
        @keyframes scroll-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scroll-right {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes subtle-pulse {
          0%, 100% { opacity: 0.55; }
          50%       { opacity: 1; }
        }
        .anim-drift-a   { animation: drift-a  13s ease-in-out infinite; }
        .anim-drift-b   { animation: drift-b  17s ease-in-out infinite; }
        .anim-scroll-l  { animation: scroll-left  28s linear infinite; }
        .anim-scroll-r  { animation: scroll-right 24s linear infinite; }
        .anim-scroll-l2 { animation: scroll-left  34s linear infinite; }
        .anim-fade-up-1 { animation: fadeUp 0.5s ease both 0.08s; }
        .anim-fade-up-2 { animation: fadeUp 0.5s ease both 0.18s; }
        .anim-fade-up-3 { animation: fadeUp 0.5s ease both 0.28s; }
        .anim-fade-up-4 { animation: fadeUp 0.5s ease both 0.38s; }
        .anim-fade-up-5 { animation: fadeUp 0.5s ease both 0.48s; }
        .anim-pulse     { animation: subtle-pulse 3s ease-in-out infinite; }
        .marquee-wrap   { overflow: hidden; }
        .marquee-track  { display: flex; gap: 14px; width: max-content; }
        input:focus     { outline: none; }
      `}</style>

      <div className="h-screen w-screen bg-white flex overflow-hidden">

        {/* ── LEFT PANEL ── */}
        <div className="hidden lg:flex w-[42%] bg-[#0d0d0d] flex-col justify-between p-10 relative overflow-hidden shrink-0">
          <div className="anim-drift-a absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#c0392b] opacity-[0.22] blur-[90px] pointer-events-none" />
          <div className="anim-drift-b absolute top-1/4 -right-16 w-64 h-64 rounded-full bg-[#e05540] opacity-[0.12] blur-[70px] pointer-events-none" />

          <span className="text-[#444] text-4xl font-medium tracking-[0.12em] uppercase relative z-10">ZipLink</span>

          <div className="flex flex-col gap-5 relative z-10">
            <div className="inline-flex items-center gap-2 bg-[#c0392b]/15 border border-[#c0392b]/30 rounded-full px-3 py-1 w-fit h-10">
              <div className="anim-pulse w-2 h-2 rounded-full bg-[#e87c6e]" />
              <span className="text-[#e87c6e] text-md">Live analytics</span>
            </div>
            <h2 className="font-primary text-[#f0f0f0] text-6xl leading-tight">
              Short links.<br />Real insights.
            </h2>
            <p className="text-[#555] text-xl leading-relaxed max-w-[400px]">
              Track clicks, locations, and referral sources in real time — no setup needed.
            </p>
            <div className="mt-2">
  
            </div>
          </div>

          <div className="flex gap-8 w-full justify-around relative z-10">
            {[
              { num: '12ms', label: 'avg redirect' },
              { num: '99.9%', label: 'uptime' },
              { num: '2M+', label: 'links created' },
            ].map(({ num, label }) => (
              <div key={label}>
                <p className="font-primary text-[#f0f0f0] text-4xl font-semibold">{num}</p>
                <p className="text-[#555] text-xl mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="flex-1 bg-[#f7f7f7] flex flex-col justify-center overflow-hidden relative">

          {/* reviews layer — more visible, less blurred overlay */}
          <div className="absolute inset-0 flex flex-col justify-center gap-4 pointer-events-none select-none" style={{ opacity: 0.75 }}>
            <div className="marquee-wrap">
              <div className="marquee-track anim-scroll-l">
                {[...row1, ...row1].map((r, i) => <ReviewCard key={i} {...r} />)}
              </div>
            </div>
            <div className="marquee-wrap">
              <div className="marquee-track anim-scroll-r">
                {[...row2, ...row2].map((r, i) => <ReviewCard key={i} {...r} />)}
              </div>
            </div>
            <div className="marquee-wrap">
              <div className="marquee-track anim-scroll-l2">
                {[...row1, ...row1].map((r, i) => <ReviewCard key={i} {...r} />)}
              </div>
            </div>
          </div>

          {/* lighter frosted overlay — reviews show through more */}
          <div className="absolute inset-0 bg-white/55 pointer-events-none" />

          {/* fade edges left/right so cards don't hard-clip */}
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#f7f7f7] to-transparent pointer-events-none z-10" />
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#f7f7f7] to-transparent pointer-events-none z-10" />

          {/* form card */}
            
{          mode==='Sign-up'?<SignUp mode={mode} onSwitch={()=>setmode('login')}/>:<Login  mode={mode} onSwitch={()=>setmode('Sign-up')} ></Login>
}

        </div>

      </div>
    </>
  )
}

export default AuthPage
