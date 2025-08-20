import  { Schema } from "mongoose";
import mongoose   from "mongoose";

const likesSchema = new Schema ( 
    {
     vedieo : {
        type : Schema.Types.ObjectId ,
        ref : "Vedieo"
     }
},
{
     comment : {
        type : Schema.Types.ObjectId ,
        ref : "Comment"
     }
},
{
    tweet: {
        type : Schema.Types.ObjectId ,
        ref : "Tweet"
     }
},
{
  Likedby : {
     type : Schema.Types.ObjectId ,
        ref :"User"
  }
},
    {
        timestamps :true 
    })

export const Likes = mongoose.model("Likes" , likesSchema)