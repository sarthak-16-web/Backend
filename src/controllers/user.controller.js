import wrapper from '../utils/wrapper.js';
import apierror from './../utils/apierror.js'
import APIresponse from './../utils/apiresponse.js'
import {User} from './../models/user.model.js'
import uploadOnCloudinary from './../utils/cloudinary.js'
import jwt from 'jsonwebtoken'
import React from 'react';

const generateAccessTokenANDrefreshToken = async(userId) => {
    try {
     const user =   await User.findById(userId);
  const accessToken =     user.generateAccessToken()
  const refreshToken =     user.generateRefreshToken()

  user.refreshToken = refreshToken ;
 await user.save({validateBeforeSave : false })

 return {accessToken , refreshToken}

    } catch (error) {
        throw new apierror(500,"Something went wrong while genrating the tokens");
    }
}

const registerUser = wrapper(async(req ,res) =>{
   
    const { username , email , password ,fullname} = req.body
    if(!username || !email || !password || !fullname){
        throw new apierror(404,"All fields are required" );  // basically apan ne ekmwrppaer bana  rkha  hai baar baar error handle nhi krna pdhega
    }
    const existingUser =  await User.findOne({
     $or : [{username},{email}]
    })
    if(existingUser){
        throw new apierror(409 ,"The field already exits create a new one ")
    }
   const avatarlocalpath     =  req.files?.avatar[0]?.path;  // optional chaing for undefined error 
    console.log(avatarlocalpath);
   const coverimagelocalpath =  req.files?.coverImage[0]?.path;

   if(!avatarlocalpath){
            throw new apierror(410 ,"The avatar files are most  required");
   }


    const avatar = await uploadOnCloudinary(avatarlocalpath)
    console.log("sherkhan",avatar);
     const coverImage = await uploadOnCloudinary(coverimagelocalpath)
  

    if(!avatar){
    throw new apierror(409 ,"The avatar files are required");}

    const user = await  User.create({
    fullname ,
    avatar :avatar.url ,
    coverImage :coverImage.url ||  "",
    email ,
    username ,
    password 
    })
   console.log(user);

   const createdUser =   await  User.findById(user._id)
   .select("-password -refreshToken")

  if(!createdUser){
    throw new apierror(400 , "Something went wrong while registering the user")
  }

 return res.status(201).json(
       new APIresponse(200 , createdUser , "USer registred successfully")
    )

})

const loginUser = wrapper(async(req,res) =>{
     const {username , email , password} = req.body 
     if(!username && !email){
        throw new apierror(404 , "Username and password is required");
     }
     if (!password) {
     throw new apierror(400, "Password is required");
     }
    const user = await  User.findOne({
   //  these are mongodb operator  array ka andar  object pass kr skte hai ; 
    $or :[{username}, {email}]
     })

     if(!user){
        throw new apierror(403 , "User doent exits");
     } 
    //   the small u user is an single user that can access the methods generate refresh token , passowrdsave is apne user mei ) na ki mongo db k User mei 
    const passwordValid =  await user.isPasswordCorrect(password)
    if(!passwordValid){
        throw new apierror(401 ,"Password incorrect ")
    }


  const {accessToken ,refreshToken} =  await generateAccessTokenANDrefreshToken(user._id)
 // bsically joh usser abhi hai apne pass uske pass sarri fieds hai password accestoken lekin we dont want to shsow these properties so we will use slect method
   const loggedinUser = await User.findById(user._id).
   select("-password -refreshToken")

   const options = {
      httpOnly : true ,
      secure : true
   }
  
   
  return  res.status(200)
   .cookie("accessToken" ,accessToken , options)
   .cookie("refreshToken",refreshToken , options)
   .json(
     new APIresponse(200 ,{
         user: loggedinUser, accessToken, refreshToken
     } , "User logged in successfully" )
   )
 

   


})

const logoutUser = wrapper(async(req,res)=>{
   await  User.findByIdAndUpdate(
     req.user._id,
       {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
       
    )

    const options = {
      httpOnly : true ,
      secure : true
   }
   return res.status(200).clearCookie("accessToken" , options)
   .clearCookie("refreshToken", options)
   .json(
    new APIresponse(200 , {}, "USer logged out Successfully")
   )
})

const refreshAccessToken = wrapper(async(req,res)=>{
    const incominfRefreshToken =  req.cookies?.refreshToken || req.body?.RefreshToken;
    // const incominfRefreshToken =  JSON.stringify(Token);
  console.log(typeof incominfRefreshToken); // string aa rhi hai 
    if(!incominfRefreshToken){
        throw new apierror(404 , "Refresh Token is does not reached ")
    }

    try {
        const decodedToken =  jwt.verify(incominfRefreshToken , process.env.REFRESH_TOKEN_SECRET)  // isey user milega phir usey uska databse mei rkha hua refresh token lengey 
         const user =   await User.findById(decodedToken?._id)
          if(!user){
            throw new apierror(404 , "Invalid refresh token ")
        }
        
        if(incominfRefreshToken !== user?.refreshToken){
            throw new apierror(404 , " refresh token is expired is used ")
        }
         const options = {
            httpOnly: true,
            secure: true
        }
       console.log("jkasadjs");
       const {accessToken, refreshToken} = await generateAccessTokenANDrefreshToken(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new APIresponse(
                200, 
                {  accessToken, refreshToken  },
                "Access token refreshed"
            )
        )
    }
     catch (error) {
       throw new apierror(404 , "unothorized acccess and invalid refresh token");   
    }



})

const changePassword = wrapper(async(req , res)=>{
  const {oldpassword , newpassword} = req.body 
  // apan ne jwt middle ware bana rkha hai waha  se user ka access ayega 
   const user =    await User.findById(req.user?._id)

   const ispassright = await  user.isPasswordCorrect(oldpassword);

   if(!ispassright){
    throw new apierror(401, "Enter the valid password for change the password")
   }

   user.password = newpassword ;
    await user.save({validateBeforeSave : false})

    return res
    .status(201)
    .json(
        new APIresponse(200 , {} , "Passowrd changed sucessfully")
    )


})

const currentUser = wrapper(async(req, res)=>{
    const user = await User.findById(req.user?._id) // databse in diff region then await is required it will fall to fetch the details 
   const name =  user.fullname
    console.log(name);
    if(!user){
        throw new apierror(401, "USer is not logged in cant fecth the current user" )
    }
  return res
  .status(200)
  .json( 
     new APIresponse("202" , {user} , "User fethched successfully" ) 
    )
})

const updatAccountDetails = wrapper(async(req, res)=>{
  const {Fullname , email} = req.body 
  if(!(Fullname  ||  email)){
    throw new apierror(401 , "Pleasse provide the new fullname or email for the change")
  }
  const user = await User.findById(req.user?._id).select("-refreshToken -password -_id -coverImage -avatar") // verify jwt se user ayega access toke k thorugh
  user.fullname = Fullname 
  user.email = email 
   await user.save({validateBeforeSave : false})
   return res
   .status(200)
   .json(
    new APIresponse(210 , {user} , "Account details checked successfully")
   )

})

const avatarChange = wrapper(async(req, res)=>{
 

  const avatarlocalpath = req.files?.avatar[0]?.path;
  if(!avatarlocalpath){
    throw new apierror(401 , "Provide the avatar again");
  }
  const avatar = await uploadOnCloudinary(avatarlocalpath)
  if(!avatar.url){
    throw new apierror(402 , "Avatar is not uploaded on cloudinary ");
  }
  const newuser  = await User.findByIdAndUpdate(
    req.user?._id ,
    {
     $set : {
       avatar : avatar.url
    }
   },
   {
    new : true 
   } 
).select("-refreshToken -password -_id -coverImage -username -email")
 

  return res
  .status(200)
  .json(
    new APIresponse(222 , {newuser} , "Avatar changed successfully")
  )

})
export default {registerUser,loginUser ,logoutUser,refreshAccessToken , changePassword , currentUser ,updatAccountDetails , avatarChange};





// before refreshtoke : 
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
// .eyJfaWQiOiI2ODkyMzQwNjEyNWNiZmRhZWIwNThhZjAiLCJpYXQiOjE3NT
// Q0MzAzODcsImV4cCI6MTc1NTI5NDM4N30.U-kYZzEYhW1Uj7X9I39D27iWP-2trVyQSvLVmzAeI5Y

//after refreshtoken :
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfa
// WQiOiI2ODkyMzQwNjEyNWNiZmRhZWIwNThhZjAiLCJpYXQiOjE3NTQ0MzAzOTksI
// mV4cCI6MTc1NTI5NDM5OX0.QIHOm2h8FgBVN10QqM441iGI0nZMEOhv2AIJii_jQ7c