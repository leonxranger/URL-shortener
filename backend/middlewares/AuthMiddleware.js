import { getAuth } from "@clerk/express";

export const RequireAuth =(req,res,next)=>{
    const {userId} = getAuth(req);
    console.log(userId);
    if(!userId){
        return res.status(401).json({error: "Unauthorized"});

    }

    req.userId = userId;
    
    next();
}