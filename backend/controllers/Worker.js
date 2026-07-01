import {redis} from '../Config/Redis.js'
import { Worker } from "bullmq";
import { CLICKS } from "../models/Clicks.js"
import { LINK } from "../models/Link.js";
import mongoose from "mongoose";
import geoip from 'geoip-lite';
import useragent from 'express-useragent';
const processClick = async ({ClickData,urlID}) => {
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