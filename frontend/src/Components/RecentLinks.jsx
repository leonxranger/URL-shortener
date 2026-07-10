import { Clock } from 'lucide-react'
import React, { useEffect } from 'react'

const RecentLinks = ({Links}) => {
  return (
    <div className=' min-h-[300px] max-h-[600px]   min-w-full bg-white rounded-xl shadow-xl shadow-indigo-500/20'>

        {/* //header */}
        <div className='w-full p-8 h-full flex flex-col'>
            
            <div className='flex flex-row gap-3 items-center'>
                <span className='bg-indigo-400/40 p-2 rounded-md shadow-xl'>
                <Clock />
                </span>
                <h1 className='font-semibold'>Recent Links</h1>
            </div>

        </div>

        {/* //table of recent links */}
        <div className='h-full w-full flex '>

            <table className='w-full relative text-zinc-400 overflow-x-scroll' >
                <hr className='absolute text-zinc-400 h-2 w-full -top-4'></hr>
                <thead className='text-xs'>
                    <tr>
                        <th>LINK</th>
                        <th>DESTINATION</th>
                        <th>CREATED</th>
                        <th>CLICKS</th>
                        <th>ACTIONS</th>
                    </tr>
                </thead>
                <hr className='absolute h-2 text-zinc-400 w-full top-7'></hr>

                <tbody className='text-xs'>
                    {Links.map((link)=>(
                        <tr key={link?._id}>
                            <td></td>

                        </tr>
                    ))}
                </tbody>


            </table>

        </div>

            
    </div>
  )
}

export default RecentLinks
