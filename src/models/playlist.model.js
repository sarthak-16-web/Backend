import  { Schema } from "mongoose";
import mongoose   from "mongoose";

const playlistSchema = new Schema ( 
   { 
    name :{
       type : String ,
       required : true 
    },

   description : {
      type : String ,
      required : true 
   
},

   vedeio : [
    {
      type : Schema.Types.ObjectId ,
      ref : "Vedieo"
    }
   ] ,

  owner : {
        type : Schema.Types.ObjectId,
        ref  : "User",
        required : true 
    
     },
     ownername : {
        type : String,
        ref  : "User",
        required : true 
     }
    },
    {
        timestamps :true 
    })

export const Playlist = mongoose.model("Playlist" , playlistSchema)