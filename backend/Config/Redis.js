import { Queue } from "bullmq";
import IORedis from 'ioredis';


const isTLS = process.env.REDIS_URL.startsWith('rediss://');

export const redis = new IORedis(process.env.REDIS_URL,
    {maxRetriesPerRequest:null},
   {
        ...(isTLS?{tls:{}} : {})

   }
);