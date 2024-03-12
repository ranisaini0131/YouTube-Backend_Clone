import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createTweet, deleteTweet, getUserTweets, updateTweet } from "../controllers/tweet.controller.js";



const router = Router()


router.post("/createTweet", verifyJWT, createTweet)

router.patch("/updateTweet/:tweetId", verifyJWT, updateTweet)

router.delete("/deleteTweet/:tweetId", verifyJWT, deleteTweet)

router.get("/getUserTweet/:userId", verifyJWT, getUserTweets)

export default router;