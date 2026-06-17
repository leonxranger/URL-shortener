import express from "express"
import 'dotenv/config'
import { ConnectDB } from "./db_connection.js";
import {clerkMiddleware} from "@clerk/express"
import { Redirector } from "./controllers/Redirecter.js";
import { CLickData } from "./middlewares/ClickData.js";
import './controllers/Worker.js'
import cors from 'cors'


const app = express();
const allowedOrigins = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : [];

app.use(cors({
  origin:function (origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS policy'));
    }
  },

  credentials: true,
}))
app.use(express.json());


const port = process.env.PORT;
import apirouter from './routers/URLrouter.js'
app.use(clerkMiddleware());
app.use(express.json())


app.use('/api',apirouter);

app.get('/:shortcode',CLickData,Redirector);

ConnectDB().then(()=>{
    app.listen(port,()=>{
    
        console.log("Listening to port " + port);
    })
})
 