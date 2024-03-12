import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { addComment, deleteComment, getVideoComments, updateComment } from "../controllers/comment.controller.js";

const router = Router()

router.post("/addComment/:videoId", verifyJWT, addComment)

router.get("/getVideoComments/:videoId", verifyJWT, getVideoComments)

router.patch("/updateComment/:commentId", verifyJWT, updateComment)

router.delete("/deleteComment/:commentId", verifyJWT, deleteComment)




export default router