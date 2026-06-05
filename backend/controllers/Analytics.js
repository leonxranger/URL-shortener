import { getAuth } from "@clerk/express"
import { CLICKS } from "../models/Clicks.js";
import { LINK } from "../models/Link.js";
export const AnalyticsController=async(req,res)=>{
    const userID = req.userId;
    const {id} = req.params;
    try{
        const Data = await CLICKS.find({urlID:id});
        res.status(200).json({Data:Data});

    }catch{
        res.status(404).json({message:"No Click-Data was found for this URL"})
    }




}