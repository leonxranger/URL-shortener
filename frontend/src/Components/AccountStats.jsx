import React, { useEffect } from 'react'
import { accountdata } from '../data/text.js'
const AccountStats = ({links,clicks}) => {
const colourMap = {
  'green-400': 'text-green-700',
  'red-400': 'text-red-400',
  'gray-400': 'text-gray-400',
  'zinc-400': 'text-zinc-400',
}
  useEffect(()=>{
    console.log(stats);

  },[])
  const stats = Object.values(accountdata).map(stat => ({
    title:stat.title,
    ...stat.fetch({links,clicks})
  }));

  
  return (
    <>
    <div className='grid grid-cols-1 mt-5 md:grid-cols-2 gap-6 h-full w-full '>
       {stats.map((stat)=>(
           <div className='bg-white rounded-xl shadow-xl p-5 flex gap-3 flex-col'>
             <h1 className='font-semibold'>{stat.title}</h1>

             <h1 className='text-4xl font-primary'>{stat.data}</h1>

             <h1 className={`text-xm ${colourMap[stat.colour]}`}>{stat.text}</h1>
           </div>
       ))}

     </div>
    </>
  )
}

export default AccountStats
