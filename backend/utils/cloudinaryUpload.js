const cloudinary = require("../config/cloudinary");
const fs = require("fs");

const getResourceType = (mimeType = "") =>
  mimeType.startsWith("image/") ? "image" : "raw";

const getFolder = (file, req) => {
  if (file.fieldname === "logo") return "placement-portal/company";
  if (file.fieldname === "resume") return "placement-portal/resumes";
  if (file.fieldname === "image" || req.path.includes("/jobs")) {
    return "placement-portal/jobs";
  }
  return "placement-portal/profiles";
};

const assertCloudinaryConfig = () => {
  const required = [
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
  ];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length) {
    throw new Error(`Missing Cloudinary env variables: ${missing.join(", ")}`);
  }
};

const uploadToCloudinary = (file, req) => {
  assertCloudinaryConfig();

  return new Promise((resolve, reject) => {
    const options = {
      resource_type: getResourceType(file.mimetype),
      folder: getFolder(file, req),
      use_filename: true,
      unique_filename: true,
    };

    if (file.buffer) {
      const stream = cloudinary.uploader.upload_stream(
        options,
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      stream.end(file.buffer);
    } else if (file.path) {
      cloudinary.uploader.upload(file.path, options, (error, result) => {
        if (error) return reject(error);
        
        // Try to clean up the temporary file created by multer
        try {
          fs.unlinkSync(file.path);
        } catch (unlinkErr) {
          console.error("Failed to delete temp file:", unlinkErr);
        }
        resolve(result);
      });
    } else {
      reject(new Error("File buffer or path is missing"));
    }
  });
};

const deleteFromCloudinary = async (publicId, resourceType = "image") => {
  if (!publicId) return;
  assertCloudinaryConfig();
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
};
