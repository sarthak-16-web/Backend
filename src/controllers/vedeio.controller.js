import { Vedieo } from "../models/vedieo.model.js";
import APIerror from "../utils/apierror.js";
import APIresponse from "../utils/apiresponse.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import wrapper from "../utils/wrapper.js";
import { User } from "../models/user.model.js";

const uploadVedieo = wrapper(async(req,res)=>{
 const {Thumbnail ,Title , Description ,IsPublished} = req.body
const user = await User.findById(req.user._id);
 if(!user) {
       throw new APIerror(402 , 'Please login for Upload a vedeio');
 }
 if(!Thumbnail || !Title || !Description || !IsPublished  ){
    throw new APIerror(402 , 'Enter all the fiels to uplaod the vedeio ');
 }
  
 const LocalvedeioPath =  req.files?.videoFile[0]?.path; 
 if(!LocalvedeioPath){
   throw new APIerror(401, "The Vedieo is not uplaoded to the local successfullt")
 }

 const cloudinaryurl = await uploadOnCloudinary(LocalvedeioPath);
 if(!cloudinaryurl){
   throw new APIerror(400 , "The vedeio doenst stored at clodinary please uplaod the again")
 }

 const VedieoDuration = 10 ;

 const vedieo  = await Vedieo.create({
    thumbnail : Thumbnail , 
    title : Title , 
    description : Description , 
    isPublished: IsPublished ,
    duration : VedieoDuration ,
    videoFile :   cloudinaryurl.url ,
    owner : user._id,
    owner_usernmae : user.username 
 })
 if(!vedieo){
   throw new APIerror(404 , "The vedeio was not uploaded suucesfully");
 }

  return res.status(200)
  .json(
   new APIresponse (202 , vedieo , "Vedeio Uplaoded Successfully")
  )

})





export default {uploadVedieo}