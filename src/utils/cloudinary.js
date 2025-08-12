import {v2 as cloudinary }from 'cloudinary';
import fs from 'fs';  // file system // read write remove files 

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key :process.env.CLOUDINARY_API_KEY,
    api_secret :process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async(localfilepath) =>{
   try {
     if(!localfilepath) return null ;
    const response =   await cloudinary.uploader.upload(localfilepath , {
        resource_type : "auto"  // img , vedieo , audio etc
     })  
     console.log("File is uplaodes on clodinary" , response.url);
      fs.unlinkSync(localfilepath);
     return response ;
   } catch (error) {
     if (fs.existsSync(localfilepath)) {
      fs.unlinkSync(localfilepath);
    }
    return null ;
   }
}

export default uploadOnCloudinary ;

