import { createClient } from "redis";
import { LINK } from "../models/Link";



export const Redirector=(req,res)=>{
    const {short_URL} = req.body;
    const cacheKey = `link:clicked:${short_URL}`;
    //the cachekey is the key which stores the URL OBJECT  in the redis db
    //if not found you are going to save the DB object as the value for the cachekey
    const redis_url =  process.env.REDIS_URL;
    try{
        const redis = createClient(redis_url);

        const cache_hit = redis.get(cacheKey);

        if(cache_hit){
            const redirect_url = new URL(cache_hit?.longURL).href ;
            if(redirect_url){
                return res.redirect(redirect_url);
            }else{
                return res.status(404).send("the long URl for the object does not exist");
            }
        };

        //if it is not present in cache then look for in the db

        const db_hit = LINK.find({short_code:short_URL});

        if(db_hit){
            const redirect_url = new URL(db_hit?.longURL).href ;

            if(redirect_url){
                //todo: // here insert the bullMQ code , which adds the url to the redis cache . if bullMQ is not used we might risk blocking the thread
                return res.redirect(redirect_url);

            }else{
                return res.status(404).send("the long URl for the object does not exist");

            }
        }



    }catch(err){
    
        res.status(400).send("Error in redirecting Controller")
    
    }
     
}