import { getAuth } from "@clerk/express";

export const RequireAuth =(req,res,next)=>{
    const {UserId} = getAuth(req);

    if(!UserId){
        res.status(401).json({error: "Unauthorized"});

    }

    req.userId = UserId;
    next();
}