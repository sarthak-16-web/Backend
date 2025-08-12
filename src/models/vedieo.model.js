import mongoose ,{Schema} from "mongoose";
import mongooseAggregatePaginate  from 'mongoose-aggregate-paginate-v2'

const vedieoSchema = new Schema({
    videoFile :{
        type : String , // cloudinary 
        required : true
    } ,
    thumbnail:{
        type :String ,
        required : true 
    },
    title :{
        type: String ,
        required : true
    },
    description: {
            type: String, 
            required: true
        },
        duration :{
            type : Number  ,
            required : true
        },   
        isPublished: {
            type: Boolean,
            default: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
},{
    timestamps : true 
})

vedieoSchema.plugin(mongooseAggregatePaginate);

export const Vedieo = mongoose.model('Vedieo' , vedieoSchema);