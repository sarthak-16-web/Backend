import express from 'express' ;
import cookieParser from 'cookie-parser';
import cors from 'cors'
const app = express();

app.use(cors({
    origin:process.env.CORS_ORGIN ,
    credentials : true
}));

app.use(express.json({limit:"10kb"}))
app.use(express.urlencoded({extended : true , limit:"16kb" }))
app.use(express.static("public"))  // exposes files from public 

app.use(cookieParser())

import router from './routes/user.routes.js';
app.use('/api/v1/user', router)

export default app;