import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { createPlaylist, updatePlaylist, deletePlaylist, addVideoToPlaylist, removeVideoFromPlaylist, getPlaylistById, getUserPlaylists } from "../controllers/playlist.controller.js"

const router = Router()

router.post("/createPlaylist", verifyJWT, createPlaylist)

router.patch("/updatePlaylist/:playlistId", verifyJWT, updatePlaylist)

router.delete("/deletePlaylist/:playlistId", verifyJWT, deletePlaylist)

router.patch("/addVideoToPlaylist/:videoId/:playlistId", verifyJWT, addVideoToPlaylist)

router.patch("/removeVideoFromPlaylist/:videoId/:playlistId", verifyJWT, removeVideoFromPlaylist)

router.get("/getPlaylistById/:playlistId", verifyJWT, getPlaylistById)

router.get("/getUserPlaylists/:userId", verifyJWT, getUserPlaylists)


export default router