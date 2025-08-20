import  { Schema } from "mongoose";
import mongoose   from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const CommentSchema = new Schema ( {
    content  : {
        type : String ,
        req : true 
    }  
},
{
    vedieo : {
        type : Schema.Types.ObjectId,
        ref : "Vedieo"
    }
},
{
   owner : {
    type : Schema.Types.ObjectId ,
    ref : "User"
   }
},
    {
        timestamps :true 
    })

    CommentSchema.plugin(mongooseAggregatePaginate)
export const Comment = mongoose.model("Comment" , CommentSchema)