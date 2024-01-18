import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";


//verify that user is present or not
export const verifyJWT = asyncHandler(async (req, res, next) => {

    try {
        //here we get access to cookie becoz of cookie-parser middleware, we added in app.js
        //req.cookies.accessToken= we added both tokens in cookies while returning response


        const token = req.cookies?.accessToken || req.header
            ("Authorization")?.replace("Bearer ", "")


        if (!token) {
            throw new ApiError(402, "Unauthorized request")
        }


        //decode jwt generated token's info to verify the token we have is correct or not

        //token can be verified by the secreat key


        const decodedTokenInfo = jwt.decode(token, process.env.ACCESS_TOKEN_SECRET)


        const user = await User.findById(decodedTokenInfo?._id).select(
            "-password -refreshToken"
        )

        if (!user) {
            throw new ApiError(404, "Invalid Access Token")
        }


        req.user = user;
        next()

    } catch (error) {

        throw new ApiError(401, error?.message ||
            "Invalid Access token")
    }


})