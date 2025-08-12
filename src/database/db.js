import mongoose  from "mongoose";
import {DB} from "../contraint.js"
import dotenv from 'dotenv'
dotenv.config();

const connectDB = async() => {
   try {
   const connectionInstance =  await mongoose.connect(`${process.env.MONGODB_URL}/${DB}`)
   console.log(`mongodb connected !! db_host ${process.env.PORT} ${connectionInstance.connection.host}`);
   } catch (error) {
    console.log("Connection terminated ",error);
   }
} 
   

export default connectDB