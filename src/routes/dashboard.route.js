import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { getChannelVideos, getChannelStats } from "../controllers/dashboard.controller.js";


const router = Router()

router.get("/getChannelStats", verifyJWT, getChannelStats)

router.get("/getChannelVideos", verifyJWT, getChannelVideos)



export default router