import { Router } from "express";
import playlistController from "../controllers/playlist.controller.js";
import { VerifyJwt } from "../middlewares/auth.middleware.js";
const createplaylist = playlistController.createplaylist
const addvedieo = playlistController.AddVedieoToThePlaylist
const router = Router();

router.route('/createplaylist').post(VerifyJwt , createplaylist);
router.route('/add/:owner').post(VerifyJwt , addvedieo);

export default router 