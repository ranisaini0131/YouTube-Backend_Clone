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















export { app } 