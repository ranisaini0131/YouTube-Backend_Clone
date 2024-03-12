import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { getUserChannelSubscribers, toggleSubscription, getSubscribedChannels } from "../controllers/subscription.ontroller.js";


const router = Router()

router.post("/toggleSubscription/:channelId", verifyJWT, toggleSubscription)

router.get("/getUserChannelSubscribers/:channelId", verifyJWT, getUserChannelSubscribers)

router.get("/getSubscribedChannels/:subscriberId", verifyJWT, getSubscribedChannels)


export default router