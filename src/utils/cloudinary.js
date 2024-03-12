import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: "dqfg38fyu",
    api_key: "788246879773559",
    api_secret: "iOdQeWjEaAsHLdEFKNygepbrL_4"
});


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        //upload to cloudinary if localFilePath exists
        const result = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto',
        });

        console.log("file uploaded to cloudinary", result.url);

        fs.unlinkSync(localFilePath); //remove file from localFilePath after uploading to cloudinary
        return result;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        return error;
    }
};

const deleteOnCloudinary = async (public_id, resource_type = "image") => {
    try {
        if (!public_id) return null;

        //delete file from cloudinary
        const result = await cloudinary.uploader.destroy(public_id, {
            resource_type: `${resource_type}`
        });
    } catch (error) {
        console.log("delete on cloudinary failed", error);
        return error;
    }
};

export { uploadOnCloudinary, deleteOnCloudinary };