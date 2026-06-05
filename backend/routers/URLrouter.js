import express from "express";
import { RequireAuth } from "../middlewares/AuthMiddleware.js";
import { createShortUrl } from "../controllers/URLshortener.js";
import { AnalyticsController } from "../controllers/Analytics.js";
import { UserURL } from "../controllers/userbasedURL.js";
const router = express.Router();

router.get('/',(req,res)=>{
    res.status(200).send({message:"Api is up and running"});

})
//generate short-code -> check if it exists in DB -> save to DB -> return to frontend
router.post('/urls',RequireAuth,createShortUrl)

//analytics
router.get('/urls/:id/analytics',RequireAuth,AnalyticsController)

//urls belonging to the connected USER
router.get('/urls/:id',RequireAuth,UserURL)

//deleting urls
router.delete('/urls/:id',RequireAuth,)
export default router;