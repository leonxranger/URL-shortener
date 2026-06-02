import mongoose from "mongoose";

const ClickSchema = mongoose.Schema({
    urlID:{
        type:String,
        required:true,
    },
    ip:{    
        type:String,
        required:true,
    },
    country:{
        type:String,
        required:true,
    },
    device:{
        type:String,
        required:true,
    },
    browser:{
        type:String,
        required:true,
    },
    referrer:{
        type:String,
        required:true,
    },
    timestamp:{
        type:Date,
        required:true,
    }
})

export const CLICKS = mongoose.model('CLICKS',ClickSchema);