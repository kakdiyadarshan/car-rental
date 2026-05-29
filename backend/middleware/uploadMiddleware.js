const { S3Client, DeleteObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const multer = require("multer");
const path = require("path");
const sharp = require("sharp");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Utility to delete an object from S3
 */
const deleteFromS3 = async (fileUrl) => {
  if (!fileUrl) return;
  try {
    const url = new URL(fileUrl);
    const key = url.pathname.substring(1);
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
    });
    await s3.send(command);
  } catch (error) {
    console.error(`Error deleting from S3: ${error.message}`);
  }
};

/**
 * Utility to convert buffer to webp and upload to S3
 */
const uploadToS3 = async (file, folder = "uploads") => {
  const fileName = `${folder}/${Date.now().toString()}-${Math.random().toString(36).substring(2, 15)}.webp`;
  
  // Convert to webp using sharp
  const buffer = await sharp(file.buffer)
    .webp({ quality: 80 })
    .toBuffer();

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: fileName,
    Body: buffer,
    ContentType: "image/webp",
  });

  await s3.send(command);
  
  // Return the public URL (Assuming bucket is public or using CloudFront)
  // Format: https://bucket.s3.region.amazonaws.com/key
  return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
};

// Use memory storage so we can process with sharp
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only images (jpeg, jpg, png, webp) are allowed!"));
  },
});

module.exports = { upload, deleteFromS3, uploadToS3 };
