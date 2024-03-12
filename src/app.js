import express from 'express'
import cors from "cors"
import cookieParser from 'cookie-parser'


const app = express()

//used for all middlewares and configurations
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

//configuring our server we are accepting jsons
app.use(express.json({ limit: "16kb" }))

//configuring URL data
app.use(express.urlencoded({ extended: true, limit: "16kb" })) // by using extended we can pass nested objects

//to store some static files and data at our server, in fille named public
app.use(express.static("public"))

//to set and access the cookies of target user
app.use(cookieParser())


//import routes
import userRouter from "./routes/user.route.js"
import videoRouter from "./routes/video.route.js"
import tweetRouter from "./routes/tweet.route.js"
import subscriptionRouter from "./routes/subscription.route.js"
import playlistRouter from "./routes/playlist.route.js"
import likeRouter from "./routes/like.route.js"
import dashboardRouter from "./routes/dashboard.route.js"
import commentRouter from "./routes/comment.route.js"

//routes declaration
app.use('/api/v1/users', userRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/subscription", subscriptionRouter)
app.use("/api/v1/playlist", playlistRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/dashboard", dashboardRouter)
app.use("/api/v1/comments", commentRouter)














export { app } 