import React, { useEffect } from 'react'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import { Plus } from 'lucide-react';
import { APICheck } from '../hooks/useLinks';
import ActiveLinks from '../Components/ActiveLinks.jsx';
import { useAccountOverview } from '../hooks/useLinks.js';
import AccountStats from '../Components/AccountStats.jsx';
import Loading from '../Components/Loading.jsx';
import Graph from '../Components/Graph.jsx';
const AnalyticsDashboard = () => {
    const {signOut} = useClerk();
    const user = useUser();
    const {data ,isPending } = useAccountOverview(user?.user?.id)

    // const{  data , isPending , isError }=useAccountOverview(user?.user?.id)
    console.log("Account status",data );


    const api_health = APICheck();

    useEffect(()=>{
      console.log("APi-status"+api_health);
    },[]);

    useEffect(()=>{
      console.log(data);
    },[])


  return (
    <div className='flex w-screen h-screen flex-col gap-10 p-10 overflow-x-hidden '> 
      {/* //header part */}
      <div className='flex w-full h-[75px] p-5 items-center border-2 flex-row justify-between '>
        <h1 className='font-primary text-4xl'>ZipLink</h1>

        <span className='flex flex-row gap-2 font-semibold items-center text-[15px]'>


          <h1 className=' bg-[#D9D9D9] rounded-xl p-2 px-5 '>{user?.user?.firstName || user?.user?.emailAddresses}</h1>

          <UserButton></UserButton>

         

        </span>

      </div>  


      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='  w-full '>

        {isPending?<div className='flex w-[300px] h-[200px]'><Loading></Loading></div>:<ActiveLinks
            ActiveLinks={data?.links}
            isLoading={isPending}
          
          />}

        </div>

        <div className='w-full h-full bg-[#e2e2e2] flex rounded-xl flex-col gap-5  p-10'>
          <h1 className='font-primary text-3xl tracking-wide'>Account Overview</h1>

          <div className='= w-full h-3/4   rounded-xl'>
{            isPending?<div className='flex w-[300px] h-[200px]'>
  <Loading></Loading>
          </div>:<AccountStats
            links={data?.links}
            clicks={data?.clicks}
            />}


          </div>

        </div>

        <div className=' h-full w-full'>
         {isPending?<Loading></Loading>:<Graph
         CLicks={data?.clicks}/>}
        </div>
      </div>
    </div>
  )
}

export default AnalyticsDashboard
