import express from "express"
import 'dotenv/config'
import { ConnectDB } from "./db_connection.js";
import {clerkMiddleware} from "@clerk/express"
import { Redirector } from "./controllers/Redirecter.js";



const app = express();
const port = process.env.PORT;
import apirouter from './routers/URLrouter.js'
app.use(clerkMiddleware());
app.use(express.json())

app.get('/:shortcode',Redirector);

app.use('/api',apirouter);
ConnectDB().then(()=>{
    app.listen(port,()=>{
    
        console.log("Listening to port");
    })
})
 