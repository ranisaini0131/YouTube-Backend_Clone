import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { deleteVideo, getVideoById, getAllVideos, publishAVideo, togglePublishStatus, updateVideo } from "../controllers/video.controller.js";

const router = Router()

router.post("/publishVideo",
    verifyJWT,
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1
        },
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]),
    publishAVideo
);

router.get("/getVideoById/:videoId", verifyJWT, getVideoById)

router.get("/getAllVideos", verifyJWT, getAllVideos)

router.patch("/updateVideo/:videoId", verifyJWT, updateVideo)

router.delete("/deleteVideo/:videoId", verifyJWT, deleteVideo)

router.patch("/togglePublishStatus/:videoId", verifyJWT, togglePublishStatus)




export default router;