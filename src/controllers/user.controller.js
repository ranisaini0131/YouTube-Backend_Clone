import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"


//a custom function to generat
const generateAccessAndRefreshToken = async (userId) => {
    try {
        //getting user access in this function
        const user = await User.findById(userId)

        //generate both tokens by invoking them here and hold in variables
        const accessToken = user.generateRefreshToken() //give to user
        const refreshToken = user.generateAccessToken()//save in db so we would not asked user for it again na gain


        //save refresh token into database by adding it to user object
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })//validateBeforeSave: false,by this the refresh token is added to the database without validation



        //return access and refresh token
        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "something went wrong while generating access and refresh token")
    }
}


const registerUser = asyncHandler(async (req, res) => {


    //get user details from froentend
    const { fullName, email, username, password } = req.body


    //validation
    if (
        [fullName, email, username, password].some((field) =>
            field?.trim === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }


    //check if user already existes:username, email
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exist")
    }

    //extracting path of images
    const avatarPath = req.files?.avatar[0].path
    const coverImagePath = req.files?.coverImage[0].path


    //create user object - create entry in db

    const user = await User.create({
        fullName,
        email,
        password,
        username: username.toLowerCase(),
        avatar: avatarPath,
        coverImage: coverImagePath
    })

    //remove password and  refresh token field from response

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )


    //check for user creation 
    if (!createdUser) {
        throw new ApiError(500, "something went wrong while registering the user")
    }


    //return res 
    return res.status(201).json(
        new ApiResponse(200, createdUser, "user registered successfully")

    )
})


const loginUser = asyncHandler(async (req, res) => {

    //get req body
    const { email, username, password } = req.body


    //username or email
    if (!(username || email)) {
        throw new ApiError(400, "username or password is required")
    }


    //find user
    const user = await User.findOne({
        $or: [{ username }, { email }]
    })


    //if user not find
    if (!user) {
        throw new ApiError(404, "user does not exist")
    }

    //check passowrd
    const isPassowrdValidate = await user.isPasswordCorrect(password) //user's password

    if (!isPassowrdValidate) {
        throw new ApiError(401, "Invalid user credentials")
    }

    //after password validation, tokens are generated
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)


    //response to user without password and refresh password
    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    //cookie
    const option = {
        //cokkies are modifyable at frontend, by these two cookies can be modifyable only server
        httpOnly: true,
        secure: true
    }

    //return response
    return res
        .status(200)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged in Successfully"
            )
        )


})

const logOutUser = asyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    const option = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", option)
        .clearCookie("refreshToken", option)
        .json(
            new ApiResponse(200, {}, "User Logout Successfully")
        )

})


const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid Refresh token")
        }

        if (incomingRefreshToken !== user.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
        }

        const option = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(user._id)

        return res.status(200)
            .cookie("accessToken", accessToken, option)
            .cookie("refreshToken", newRefreshToken, option)
            .json(
                new ApiResponse(
                    {
                        accessToken,
                        refreshToken: newRefreshToken,
                    },
                    "Access Token refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Refresh Token")
    }

})


const changePassord = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid password")
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res.status(200)
        .json(
            new ApiResponse(200, {}, "Passowrd changed successfully")
        )


})


const getCurrentUser = asyncHandler(async (req, res) => {

    return res.status(200)
        .json(new ApiResponse(200, req.user, "current user fetched successfully"))


})


const updateUserDetails = asyncHandler(async (req, res) => {

    const { fullName, email } = req.body

    if (!fullName || !email) {
        throw new ApiError(400, "All fields are required")
    }

    const user = User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email: email
            }
        },
        { new: true }

    ).select("-password")

    return res.status(200)
        .json(new ApiResponse(200, user, "account details updated successfully"))


})

const updateUserAvatar = asyncHandler(async (req, res) => {
    const image = req.files?.avatar[0]?.path

    if (!image) {
        throw new ApiError(400, "image file is missing")
    }

    const updateImage = await User.findByIdAndUpdate(req.user?._id,
        {
            $set: {
                image
            }
        },
        {
            new: true
        }
    ).select("-password")

    return res
        .status(200)
        .json(new ApiResponse(200, updateImage, "profile picture updated"))
})


const getUserChannelProfile = asyncHandler(async (req, res) => {

    const { username } = req.params

    if (username?.trim()) {
        throw new ApiError(400, "username is missing")
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username?._id
            }
        },
        {
            $lookup: {
                from: "subscription",//model name
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscription",//model name
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "subscribers",
                },
                channelsSubscribedToCount: {
                    "$size": "subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: {
                            $in: [req.user?._id,
                                "$subscribers.subscriber"]
                        },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullName: 1,
                username: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1
            }
        }
    ])

    if (!channel?.length) {
        throw new ApiError(400, "channel does'nt exist")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, channel[0], "user channel fetched successfully")
        )
})







export {
    registerUser,
    loginUser,
    logOutUser,
    refreshAccessToken,
    changePassord,
    getCurrentUser,
    updateUserDetails,
    updateUserAvatar,
    getUserChannelProfile
}