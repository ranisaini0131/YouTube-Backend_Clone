import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

const uploadOnCloudinary = async (localFilePath) => {

    try {
        if (!localFilePath) return null

        //upload file o cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })

        //file uploaded successfully
        console.log("full response", response)
        console.log("file is uploaded on cloudinary", response.url)

        return response;

    } catch (error) {

        fs.unlinkSync(localFilePath)//remove locally saved temp files 

        return null

    }
}


export { uploadOnCloudinary }













