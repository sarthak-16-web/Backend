import { Playlist } from "../models/playlist.model.js";
import APIerror from "../utils/apierror.js";
import APIresponse  from "../utils/apiresponse.js";
import { User } from "../models/user.model.js";
import wrapper from "../utils/wrapper.js";
import { Vedieo } from "../models/vedieo.model.js";

const createplaylist = wrapper(async (req , res)=>{
 const {Playlistname , description} = req.body ;
    const user = await User.findById(req.user._id);
    if(!user){
        throw new APIerror(400 , "pLease login for creating the playlist" )
    }
    if(!Playlistname || ! description){
        throw new APIerror(404 , "Name and description of the playlist is required");
    }

    const UserPlaylist = await Playlist.create({
        name  : Playlistname , 
        description  :description ,
        owner : user._id  ,
        ownername : user.username
        // the id of the user and the owner is same which is id
        })
        

  return res
  .status(200)
  .json(
   new APIresponse( 202 , {UserPlaylist} , "Playlist created successfully")
  );

})
const AddVedieoToThePlaylist = wrapper (async(req, res)=>{
    const {owner} = req.params ;
    // const {playlistId, videoId} = req.params

    return res.status(201)
    .json(
        new APIresponse(200 , "Vedeio added succesfullt")
    )
})
export default  {createplaylist  , AddVedieoToThePlaylist};

// Playlist owner accestoken
// Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODkyMzQwNjEyNWNiZmRhZWIwNThhZjAiLCJlbWFpbCI6Inh5emVAZ21haWwuY29tIiwidXNlcm5hbWUiOiJzeXN0ZW0iLCJpYXQiOjE3NTUyMTg4MTUsImV4cCI6MTc1NTMwNTIxNX0.878Wv60ofn8tbKD4HqZ3nbTIYXOC2NVT472wNNUAhqg

// vedeioonwer accestoken
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODk1MGU0NjU2OTY1OGUwMmE2NGJjM2MiLCJlbWFpbCI6ImpzdXBheUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6InN1eWFzaCIsImZ1bGxuYW1lIjoiU3V5YWhzIGthc2F0IiwiaWF0IjoxNzU1MjE5MTM3LCJleHAiOjE3NTUzMDU1Mzd9.A9HZNKj52Mef20QWJXkLuz-5ovlu-opvfG8Xcy1--qk