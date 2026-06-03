import mongoose from "mongoose"
import { LINK } from "./models/Link.js";




const DB_URL = process.env.DB_URL
export const ConnectDB=async()=>{

    try{
        await mongoose.connect(DB_URL);
        console.log("MONGO-DB CONNECTED");
    }catch(err){
        console.error(err);
    }
}       