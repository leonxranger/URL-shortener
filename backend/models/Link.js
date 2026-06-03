import mongoose from "mongoose"

const LinkSchema = new mongoose.Schema({
    short_code:{
        type:String,
        required:true,
        unique:true,
    },
    longURL:{
        type:String,
        required:true,
    },
    created_at:{
        type:Date,
        default:Date.now,
    },
    expiration_date:{
        type:Date,
    },
    userID:{
         type: String,
         required: true 
    }
});

LinkSchema.pre('save',async function(){
    if(!this.created_at){
        this.created_at = new Date();
    }
    if(!this.expiration_date){
        this.expiration_date = new Date(this.created_at.getTime() + 24*20*60*60*1000)
    }

})

export const LINK = mongoose.model('LINK',LinkSchema);