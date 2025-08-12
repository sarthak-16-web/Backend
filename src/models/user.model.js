import mongoose , {Schema} from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new Schema({
    username : {
      type : String ,
      required : true ,
      trim : true ,
      unique : true ,
      lowercase : true ,
      index : true 
    },
    email : {
      type : String ,
      required : true ,
      trim : true ,
      unique : true ,
      lowercase : true 
    },
    password :{
     type : String ,
     required : true ,
     unique : true
    },
    watchHistory : [{
       type :Schema.Types.ObjectId ,
       ref :"Vedieo"
    }
    ],
    refreshToken :{
         type : String
    },
    fullname:{
      type : String ,
      required : true ,
      trim : true ,
      index : true 
    },
    coverImage :{
        type: String,
    },
    avatar :{
     type : String,
     required:true 
    }
},{
    timestamps : true 
})
// password save hone se encyrpt ho jaye or store ho hash form mei ;
userSchema.pre("save" , async function(next){
  if(!this.isModified("password")) return next() ;
  this.password = await bcrypt.hash(this.password , 10) ; 
  next() ;
})
// we can create custom middlewares or methods  for single user 
// password sahi hai ya nhi usko check krlo 
userSchema.methods.isPasswordCorrect = async function (password) {
    return await  bcrypt.compare(password , this.password);
}
// in sabh mei arrow function isliye nhi letey kyuki hame this ka access cahiye rhta hai joh ki arrow fun meinhi milta
// yeh sarri cheeze database se aa rhi hai 
userSchema.methods.generateAccessToken = function(){
  return jwt.sign({
    _id: this._id ,
    email :this.email ,
    username :this.username,
    fullname :this.fullname
   },
   process.env.ACCESS_TOKEN_SECRET ,
   {
      expiresIn : process.env.ACCESS_TOKEN_EXPIRY
   }
)
}
userSchema.methods.generateRefreshToken = function(){
 return jwt.sign({
     _id : this._id
  },
   process.env.REFRESH_TOKEN_SECRET ,
   {
      expiresIn : process.env.REFRESH_TOKEN_EXPIRY
   }
)
}

export const User = mongoose.model('User' , userSchema);