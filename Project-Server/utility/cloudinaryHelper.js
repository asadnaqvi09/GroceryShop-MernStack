import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = async (buffer, folder) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    ).end(buffer);
  });
};

export const deleteFromCloudinary = async (public_id) => {
  if (!public_id) return;
  await cloudinary.uploader.destroy(public_id);
};