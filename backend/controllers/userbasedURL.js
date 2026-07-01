    import { LINK } from "../models/Link.js";

    export const UserURL = async(req,res)=>{

        try{

            const {id} = req.params;

            const result = await LINK.find({userID:id});

            return res.status(200).json({data:result})

        }catch(err){
            console.log(err);
        }

    }