import multer from "multer";

const memoryUpload = multer({ storage: multer.memoryStorage() });
export default memoryUpload;
