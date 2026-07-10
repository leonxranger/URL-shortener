import React, { useEffect } from 'react'
import { accountdata } from '../data/text.jsx'
import { Dot, TrendingDown, TrendingUp } from 'lucide-react'
const AccountStats = ({links,clicks}) => {
const colourMap = {
  'green-400': {color:'text-green-700'},
  'red-400': {color:'text-red-400'},
  'gray-400':{color:'text-gray-400'},
  'zinc-400':{color:'text-zinc-400'},
}
  useEffect(()=>{
    console.log(stats);

  },[])
  const stats = Object.values(accountdata).map(stat => ({
    title:stat.title,
    svg:stat.svg,
    ...stat.fetch({links,clicks})
  }));

  
  return (
    <>
    <div className='grid grid-cols-1 mt-5 md:grid-cols-4 gap-6 h-full w-full '>
       {stats.map((stat)=>(
           <div style={{transition:'ease-in-out' , transitionDuration:'0.2'}} className='bg-white rounded-xl  shadow-indigo-500/20 hover:-translate-y-1 hover:cursor-pointer  shadow-xl p-5 flex gap-3 flex-col'>
            <div className='flex flex-row gap-3 mb-4 items-center'>
              <div className=' icon p-2 w-[43px] items-center justify-center flex rounded-md bg-indigo-400/20 shadow-xl ring-indigo-700 '>{stat.svg}</div>
              <h1 className='font-semibold'>{stat.title}</h1>
             </div>

             <h1 className='text-3xl font-primary'>{stat.data}</h1>

             <div className={`flex flex-row gap-2 ${colourMap[stat.colour]?.color}`}>

              {stat.colour == 'red-400'?<TrendingDown />:stat.colour == 'green-400'?<TrendingUp/>:<Dot/>}

              <h1 className={`text-xm ${colourMap[stat.colour]?.color} `}>{stat.text}</h1>
          
             </div>
           </div>
       ))}

     </div>
    </>
  )
}

export default AccountStats
