import { Worker } from "bullmq";
import IORedis from "ioredis";
import { CLICKS } from "../models/Clicks.js";


const redis = new IORedis(process.env.REDIS_URL);

new Worker('redirect-jobs',async(job)=>{
    if(job.name === 'cache-url'){
        const {cacheKey , UrlObject} = job.data;
        await redis.set(cacheKey, JSON.stringify(UrlObject),'EX',3600)
    }if(job.name === 'save-click'){
        const {userID , ClickData ,urlID} = job.data;

        
        await CLICKS.create(
            {
                urlID:urlID,
                ip:ClickData.ip,
                country:ClickData.country,
                device:ClickData.device,
                browser:ClickData.browser,
                referrer:ClickData.referrer,
                timestamp:ClickData.timestamp,
            }
        )
    }
},{connection:redis})