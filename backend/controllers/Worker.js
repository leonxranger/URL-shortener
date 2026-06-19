import { Worker } from "bullmq";
import IORedis from "ioredis";
import { CLICKS } from "../models/Clicks.js"

import { LINK } from "../models/Link.js";
import mongoose from "mongoose";
import geoip from 'geoip-lite';
import useragent from 'express-useragent';

const redis_url = process.env.REDIS_URL;

export const isTLS = redis_url.startsWith('rediss://');

const redis = new IORedis(redis_url,{maxRetriesPerRequest:null},{
    ...(isTLS?{tls:{}} : {})
});

const processClick = async ({ClickData,urlID}) => {
  console.log("ClickData:",ClickData)
  const { ip, ua, referrer } = ClickData;
  const geo = geoip.lookup(ip);
  try{
      const result = await CLICKS.create({
    urlID,
    ip,
    country: geo?.country || 'unknown',
    device: ua.isMobile ? 'Mobile' : ua.isTablet ? 'Tablet' : 'Desktop',
    browser: ua.browser,
    referrer:referrer,
    timestamp: new Date(),
    });
      console.log("Final Click Data",result);


  }catch(err){
    console.log(err);
  }


};


new Worker('redirect-jobs',async(job)=>{
    if(job.name === 'cache-url'){
         const {cacheKey , UrlObject} = job.data;
        await redis.set(cacheKey, JSON.stringify(UrlObject),'EX',3600)
        console.log("link saved to cache");
    }if(job.name === 'save-click'){
        const {  ClickData ,urlID} = job.data;

        await processClick({ClickData,urlID});

       await LINK.findByIdAndUpdate(new mongoose.Types.ObjectId(urlID), { $inc: { clicks: 1 } });
    }

    console.log("Worker completed loading to db");



},{connection:redis})