import { request } from "express";
import { LINK } from "../models/Link.js";
import { getAnalytics } from "../Utils/analytics.js";

export const LinkWiseData=async(req,res)=>{

    const {shortcode} = req.params;
    const userId = req.userId;
    const range = req.query.range || "week";

    try{
        const link = await LINK.findOne({short_code:shortcode ,userID:userId});
        if (!link) return res.status(404).json({ error: "Link not found" });

        if (!["week", "month", "year"].includes(range)) {
        return res.status(400).json({ error: "Invalid range" });
        }
        const data = await getAnalytics(link, range);

        return res.json({Data:data});

    }catch(err){
        console.log("Error in the link wise analytics controller",err);
    }

}