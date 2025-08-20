import { Router } from "express";
import { VerifyJwt } from "../middlewares/auth.middleware.js";
import vedeioController from "../controllers/vedeio.controller.js";
import {upload} from '../middlewares/multter.middleware.js'
const uploader = vedeioController.uploadVedieo
const router = Router();


router.route('/addvedieo').post(VerifyJwt , 
    upload.fields([
        {
            name :"videoFile",
            maxCount : 1
                }]
    ) , uploader);


export default router 