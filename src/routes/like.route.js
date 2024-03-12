import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { toggleVideoLike, toggleCommentLike, toggleTweetLike, getLikedVideos } from "../controllers/like.controller.js"

const router = Router()

router.post("/toggleVideoLike/:videoId", verifyJWT, toggleVideoLike)

router.post("/toggleCommentLike/:commentId", verifyJWT, toggleCommentLike)

router.post("/toggleTweetLike/:tweetId", verifyJWT, toggleTweetLike)

router.get("/getLikedVideos", verifyJWT, getLikedVideos)


export default router