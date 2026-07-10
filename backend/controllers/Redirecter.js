import { LINK } from "../models/Link.js";
import { Queue } from "bullmq";
import { redis } from "../Config/Redis.js";
// import IORedis from 'ioredis';
// import { isTLS } from "./Worker.js";
// //we dont want the connection / queue to be recreated everytime the function is run ,so we declare them outside the function
// const redis = new IORedis(process.env.REDIS_URL,
//     {maxRetriesPerRequest:null},
//    {
//         ...(isTLS?{tls:{}} : {})

//    }
// );


const RedirectQueue = new Queue('redirect-jobs',{connection:redis});



export const Redirector= async(req,res)=>{
    const {shortcode} = req.params;
    const cacheKey = `link:clicked:${shortcode}`;
    //the cachekey is the key which stores the URL OBJECT  in the redis db
    //if not found you are going to save the DB object as the value for the cachekey
    //*hand the cacheKey to BullMQ for storage

    try{

        const cached = await redis.get(cacheKey);
        const cache_hit = cached?JSON.parse(cached):null;

        if(cache_hit){
            console.log("Redirected from cache");
            const redirect_url = new URL(cache_hit?.longURL).href ;
            if(redirect_url){
                await RedirectQueue.add('save-click',{userID:req.userId , ClickData:req.ClickData ,urlID:cache_hit._id.toString() });
                console.log("Click data added to CLICKS db");
                return res.redirect(redirect_url);
            }else{
                return res.status(404).send("the long URl for the object does not exist");
            }
        };

        //if it is not present in cache then look for in the db

        const db_hit = await LINK.findOne({short_code:shortcode});

        if(db_hit){
            const redirect_url = new URL(db_hit?.longURL).href ;
            console.log("db-hit!!!",redirect_url)
            if(redirect_url){
                //todo: // here insert the bullMQ code , which adds the url to the redis cache . if bullMQ is not used we might risk blocking the thread
                //*done
                //for saving to REDIS
                await RedirectQueue.add('cache-url',{cacheKey,UrlObject:db_hit});
                //for adding to DB-CLICKS
                //**._id is not the shortcode it is the object id of the mongoDB object */
                await RedirectQueue.add('save-click',{ ClickData:req.ClickData ,urlID:db_hit._id.toString() });
                return res.redirect(redirect_url);

            }else{
                return res.status(404).send("the long URl for the object does not exist");

            }
        }



    }catch(err){
        console.log(err)
        res.status(400).send("Error in redirecting Controller",err)
    
    }
     
}