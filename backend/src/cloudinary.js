import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
const {CLOUDINARY_CLOUD_NAME,CLOUDINARY_API_KEY,CLOUDINARY_API_SECRET} = process.env;
if (!CLOUDINARY_CLOUD_NAME||!CLOUDINARY_API_KEY||!CLOUDINARY_API_SECRET){
  //ตรวจสอบ process env
  console.warn("missing cloudinary env var set CLOUDINARY_NAME,CLOUDINARY_API_KEY ,CLOUDINARY,API_SECREST")
}
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure:true
});

export function uploadBufferToCloudinary(buffer, folder = "portfolio") {
  if (!buffer || !(buffer instanceof Buffer)){
    return Promise.reject(new TypeError ("uploadBufferTocloudinary expects a Buffer "));
  }
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (err, result) => {
        if (err) return reject(err);
        if(!result) return reject (new Error("No result from Cloudinary"));
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    //ใช้ streamifier เพื่อ buffer เข้า uploud_Stream อย้างปลอดภัย 
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

export async function deleteFromCloudinary(publicId) {
  if (!publicId) return;
  try {
    // invalidate:true ถ้าต้องการลบ CDN cache ด้วย
    const res = await cloudinary.uploader.destroy(publicId, { invalidate: true });
    return res;
  } catch (err) {
    console.error("Cloudinary delete failed for ", publicId, err);
  }
}

export default cloudinary;
// npm install streamifier
