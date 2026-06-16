import { BarChart, BarChart3, Check, Copy, ExternalLink, Link, Plus } from 'lucide-react'
import React from 'react'
import { GenerateShortUrl } from '../hooks/useLinks.js'
import { useState } from 'react'
import {useNavigate} from 'react-router'
import Loading from './Loading.jsx'
const ActiveLinks = ({ActiveLinks , isLoading}) => {

    const [error , seterror] = useState({});
    const [url ,setURL] = useState('');
    const [shortURl , setshortURL] = useState('')
    const [copied , setcopied ] = useState(false)

    const navigate = useNavigate();
    const {mutateAsync , isPending , isSuccess } = GenerateShortUrl();

    console.log("ActiveLinks",ActiveLinks)

    const handelGeneratelink=async(url)=>{

        if(!url){
            seterror({message:"Please enter a valid URL starting with https://"});
            return;
        }

        try{
            const result = await mutateAsync(url);
            if(result){
                setshortURL(result);
                console.log(result);
            }

        }catch(err){
            seterror(err);
            console.log(err);
        }

    }

    const handelCopy=()=>{
    navigator.clipboard.writeText(shortURl);
    setcopied(true);
    setTimeout(() => setcopied(false), 2000);
    }

    if(isLoading){
        return Loading
    }else{
  return (
    <div className='h-full flex flex-col w-full rounded-xl p-4 max-h-[500px] overflow-scroll min-h-[200px] bg-[#E2E2E2] gap-4'>

        {/* header */}
        <div className='flex flex-row justify-between gap-2 items-center  '>
            <div className='flex flex-row  items-center gap-3 '>
                <h1 className='flex text-2xl font-primary tracking-wide'>Active Links</h1>
                <div className='h-3 w-3 bg-green-600  rounded-full animate-pulse'></div>
            </div>

            <button onClick={()=>document.getElementById('my_modal_1').showModal()} className='flex flex-row  gap-1 translate-x-0  p-2 bg-[#999292] rounded-md text-zinc-800 text-xs font-bold  tracking-wide hover:cursor-pointer shadow-xl  items-center'>
                <Plus></Plus>
                Create Link
            </button>


{/* //dialogue for generating url */}
            <dialog id="my_modal_1" className="modal">
                <div className="modal-box bg-[#d9d9d9] rounded-3xl p-10 flex flex-col gap-5" >
                    <span className='flex flex-col gap-2'>
                        <h1 className='text-3xl font-primary'>Create A New Url</h1>
                        <p className='text-md'>Paste a long link and get a short one</p>

                    </span>

                    <div className='flex flex-col w-full gap-2'>
                        <h1 className='text-xs'>Long URL</h1>
                        <div className='flex flex-col gap-1 w-full'>

                            <span className='flex flex-row gap-2'>
                                {/* //long-url-container */}
                                <input type='url' onChange={(e)=>setURL(e.target.value)} className='w-full bg-white p-2 rounded-xl text-xs shadow-xl'></input>
                                <button onClick={()=>handelGeneratelink(url)} className='btn btn-neutral bg-[#3c3b3b] font-bold rounded-xl '>Generate</button>
                            </span>

                            <h1 className='text-sm text-red-700/80'>{error.message}</h1>

                        </div>

                    </div>

                    {isPending && <p className='text-center'>Generating</p>}

                    {

                        isSuccess && 
                        <div className='flex flex-col gap-5 '>                                    
                            <div className='flex flex-col gap-2'>
                                <hr className='w-full  h-2 '></hr>
                                <h1 className='text-xs'>Short URL</h1>
                                <div className='flex flex-row w-full gap-3'>
                                    <div className='h-10 w-3/4 text-xs items-center flex bg-white rounded-xl p-2'>
                                        <h1>{shortURl}</h1>
                                    </div>
                                    <button onClick={()=>handelCopy()} className='btn rounded-xl'>
                                        <Copy></Copy>
                                        {copied?'Copied':'Copy'}
                                    </button>
                                </div>
                            </div>

                            {copied &&<div className='h-10 w-full bg-zinc-500/60 flex-row flex gap-2 items-center rounded-xl p-2 '>
                                <Check className='text-green-800'></Check>
                                <h1 className='text-sm'>Your link is ready to share</h1>
                            </div> }   
                        </div>

                        

                    }
                </div>
            </dialog>

        </div>

            {/* Column headers */}
            <div className='grid grid-cols-[2fr_3fr_1fr] w-full px-2'>
                <h1 className='text-sm font-primary'>Short URL</h1>
                <h1 className='text-sm font-primary'>Destination</h1>
                <h1 className='text-sm font-primary'>Clicks</h1>
            </div>

            <hr className='mt-2' />

            {/* Link rows */}

            <div className='flex flex-col gap-3 mt-2 w-full'>
                {ActiveLinks?.map((link, idx) => (
                    <div key={idx} className='grid grid-cols-[2fr_3fr_1fr] w-full px-2 sm:px-4 py-3 sm:py-2 bg-white/40 rounded-xl items-center text-sm sm:text-xs'>

                        <div className='flex flex-row items-center gap-1 text-blue-800 font-bold truncate pr-2'>
                            <div className='h-2 w-2 sm:h-2 sm:w-2 bg-green-500 rounded-full animate-pulse flex-shrink-0'></div>
                            <span className='truncate'>{import.meta.env.VITE_BACKEND_URL}/{link.short_code}</span>
                        </div>

                        <div className='font-medium text-gray-700 truncate pr-2'>
                            {link.longURL.split('/')[2]}
                        </div>

                        <div className='flex flex-row items-center gap-2 sm:gap-3'>
                            <span className='font-bold'>{link.clicks}</span>
                            <div className='flex flex-row gap-2 text-gray-500'>
                                <Copy size={15} className='sm:w-[13px] hover:text-black cursor-pointer' />
                                <BarChart3 size={15} className='sm:w-[13px] hover:text-black cursor-pointer' />
                                <ExternalLink onClick={()=>window.open(link.longURL,'_blank')} size={15} className='sm:w-[13px] hover:text-black cursor-pointer' />
                            </div>
                        </div>

                    </div>
                ))}
            </div>
    </div>
  )
}
}

export default ActiveLinks
