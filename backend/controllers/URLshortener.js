import { LINK } from "../models/Link.js";
import { GenerateShortCode } from "../Utils/Encoder.js";

export const createShortUrl= async(req,res)=>{
    const base_url = process.env.BASE_URL;
    const {longURL} = req.body;
    const UserID = req.userId;

    let ShortCode = "";
    let exists;

    do{
        ShortCode = GenerateShortCode();
        const exists = await LINK.findOne({short_code:ShortCode});
    }while(exists);

    await LINK.create({
        longURL:longURL ,
        short_code:ShortCode ,
        userID:UserID
    });

    res.status(200).json({URL:`${base_url}/${ShortCode}`});
}

