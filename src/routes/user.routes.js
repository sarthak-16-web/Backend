    import Router from 'express';
    import {upload} from '../middlewares/multter.middleware.js'
    import { VerifyJwt } from '../middlewares/auth.middleware.js';
    import userController from '../controllers/user.controller.js';
 
 const register =    userController.registerUser;
 const Login = userController.loginUser
 const logout = userController.logoutUser
 const refreshToken = userController.refreshAccessToken
 const passchange = userController.changePassword
 const currntuser = userController.currentUser
 const UpdateUserDetails = userController.updatAccountDetails
 const changeavatar = userController.avatarChange 
 const router = Router();

  router.route("/register").post(
        upload.fields(  // middleware
            [
                {
            name :"avatar",
            maxCount : 1
                },
                {
            name :"coverImage",
                maxCount : 1
                }   
            ]
        ) ,
          register);

router.route("/login").post(Login)
router.route("/logout").post(VerifyJwt , logout)   // aap kitne bhi middleware lga lo lekin next use kro kyuki router ko pata ho ki aage bhi jana hai 
router.route("/refreshToken").post(refreshToken)   // aap kitne bhi middleware lga lo lekin next use kro kyuki router ko pata ho ki aage bhi jana hai 
router.route("/changePassword").post(VerifyJwt , passchange)   // aap kitne bhi middleware lga lo lekin next use kro kyuki router ko pata ho ki aage bhi jana hai 
router.route("/currentUser").post(VerifyJwt , currntuser)   // aap kitne bhi middleware lga lo lekin next use kro kyuki router ko pata ho ki aage bhi jana hai 
router.route("/details").post(VerifyJwt , UpdateUserDetails)   // aap kitne bhi middleware lga lo lekin next use kro kyuki router ko pata ho ki aage bhi jana hai 
router.route("/changeavatar").post(VerifyJwt , upload.fields([{   name :"avatar",   maxCount : 1  }]), changeavatar )


 export default router;