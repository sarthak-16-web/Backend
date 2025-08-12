import mongoose , {Schema} from "mongoose";


const subscriptionSchema = new Schema({
  channel : {
    type : Schema.Types.ObjectId ,
    ref : "User"
  },
    subscribed : {
    type : Schema.Types.ObjectId ,
    ref : "User"
  }
},{
    timestamps : true 
})

export const Subschema = mongoose.model("Subschema" , subscriptionSchema)