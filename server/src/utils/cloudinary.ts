import { v2 as cloudinary } from "cloudinary";
import config from "../config/env.config";

cloudinary.config({
  cloud_name: config.cloudName,
  api_key: config.cloudKey,
  api_secret: config.cloudSecret,
});

export default cloudinary;
