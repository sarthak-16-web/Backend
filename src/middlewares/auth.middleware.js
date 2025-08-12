import APIerror from "../utils/apierror.js"
import wrapper from "../utils/wrapper.js"
import jwt from 'jsonwebtoken';
import {User} from './../models/user.model.js'

export const VerifyJwt = wrapper(async(req , _ , next)=>{
  try {
    const token =  req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
  
    if(!token){
      throw new APIerror(401,"Unothorized  half request");
    }
   
    const decoded  = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)
  
   const user =   await  User.findById(decoded?._id).select("-password -refreshToken")  // Returns undefined safely if decoded is undefined
   if(!user){
      throw new APIerror(402 , " Invalid access token ");
   }
  
   req.user = user ; //  iskey through apan ko user ka acces mil jayega logout handler mei 
   next()
  
  } catch (error) {
          throw new APIerror(406 , error?.message || "Invalid access token");

  }
})
