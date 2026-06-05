import { LINK } from "../models/Link"
import IORedis from 'ioredis';

const redis = new IORedis(process.env.REDIS_URL);

export const DeleteURl=async(req,res)=>{

    try {
        const {id} = req.params();


        const deleted = await LINK.findByIdAndDelete(id); 

        if(deleted){
            const cacheKey = `link:clicked:${deleted?.short_code}`
            await redis.del(cacheKey);
            res.status(200).json({message:"Successfully deleted from the database"})
        }
    } catch (error) {
        console.log("Error in deleteURL controller" + error);
    }

}