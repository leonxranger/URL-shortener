import { getAuth } from "@clerk/express";

export const RequireAuth =(req,res,next)=>{
    const UserID = getAuth(req);

    if(!UserID){
        res.status(401).json({error: "Unauthorized"});

    }

    req.userId = UserID;
    next();
}