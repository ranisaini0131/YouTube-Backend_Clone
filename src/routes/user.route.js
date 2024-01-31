import { Router } from 'express'
import {
    logOutUser,
    loginUser,
    refreshAccessToken,
    registerUser,
    changePassword,
    getCurrentUser,
    updateUserDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory
}
    from '../controllers/user.controller.js';

import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/register',
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)


router.post("/login", loginUser)


//secured Routes

router.post("/logout", verifyJWT, logOutUser)
router.post("/refresh-token", refreshAccessToken)
router.post("/changePassword", verifyJWT, changePassword)
router.post("/currentUser", verifyJWT, getCurrentUser)
router.patch("/updateProfile", verifyJWT, updateUserDetails)

router.patch("/updateProfilePicture", verifyJWT, upload.single("avatar"), updateUserAvatar)
router.patch("/updateCoverImage", verifyJWT, upload.single("coverImage"), updateUserCoverImage)

router.get("/getUserChannelProfile/:username", verifyJWT, getUserChannelProfile)
router.get("/watchHistory", verifyJWT, getWatchHistory)










export default router;