import AWS from "aws-sdk";
import {
  aws_access_key_id,
  aws_secret_access_key,
  Bucket_name,
  space_End_point,
} from "./ServerPath";
import axios from "axios";

export const uploadFile = async (FileName, folderStructure) => {
  try {
    const formData = new FormData();
    formData.append("folderStructure", folderStructure);
    formData.append("keyName", FileName?.name);
    formData.append("content", FileName);

    const response = await axios.post(`file/upload-file`, formData);
    const resDataUrl = response.data.url;
    console.log("resDataUrl", resDataUrl);

    const spaceEndpoint = new AWS.Endpoint(space_End_point);
    const fileName = folderStructure + "/" + FileName.name;

    const s3 = new AWS.S3({
      endpoint: spaceEndpoint,
      accessKeyId: aws_access_key_id,
      secretAccessKey: aws_secret_access_key,
    });

    const params = {
      Bucket: Bucket_name,
      Key: fileName,
      Expires: 60,
    };

    const imageURL = await new Promise((resolve, reject) => {
      s3.getSignedUrl("getObject", params, (err, url) => {
        if (err) {
          console.error("Error generating presigned URL:", err);
          reject(err);
          return;
        }
        resolve(url);
      });
    });

    return { resDataUrl, imageURL };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const covertURl = async (FileName) => {
  try {
    const spaceEndpoint = new AWS.Endpoint(space_End_point);

    const s3 = new AWS.S3({
      endpoint: spaceEndpoint,
      accessKeyId: aws_access_key_id,
      secretAccessKey: aws_secret_access_key,
    });

    const params = {
      Bucket: Bucket_name,
      Key: "mova/" + FileName,
      Expires: 60,
    };

    const imageURL = await new Promise((resolve, reject) => {
      s3.getSignedUrl("getObject", params, (err, url) => {
        if (err) {
          console.error("Error generating presigned URL:", err);
          reject(err);
          return;
        }

        resolve(url);
        console.log("url", url);
      });
    });

    console.log("imageURL", imageURL);
    return { FileName, imageURL };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
