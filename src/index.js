import connectDB from './database/db.js'
import dotenv from 'dotenv'
import app from './app.js' 
dotenv.config({
    path : './env'
})
const PORT = process.env.PORT || 4000;

connectDB()
.then(()=>{
  app.get('/login' ,(req,res) =>{
    res.send("You are dogg ek the conenciton")
  })
    app.listen(PORT, ()=>{
         console.log(`Listening at port http://localhost:${PORT}`)
    })
})
.catch((error)=>{
   console.log("Listening failed")
})













/* 1st approach 
const app = express();
(async()=>{
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/${DB}`)
    app.on("error " ,(error )=>{
     console.log(error);
     throw error ;
    })
    app.listen(process.env.PORT , ()=>{
        console.log(`Backend coonected successfully can be viewed on port https://localhost:${process.env.PORT}`)
    })
  }
   catch (error) {
    console.log("Database not connected succesfully");
    throw error; 
  }
})(
  */