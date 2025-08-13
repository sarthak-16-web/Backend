import mongoose , {Schema} from "mongoose";


const subscriptionSchema = new Schema({
  channel : {                            // one to whom subscriber is subscribing
    type : Schema.Types.ObjectId , 
    ref : "User"
  },
    subscribed : {
    type : Schema.Types.ObjectId ,      // one who is subscribing 
    ref : "User"
  }
},{
    timestamps : true 
})

export const Subschema = mongoose.model("Subschema" , subscriptionSchema)