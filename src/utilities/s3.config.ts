import { sendEmail } from './../service/sendEmail';
import { storageEnum } from "./../middleware/multer.cloud";
import { createReadStream } from "fs";
import { v4 as uuidv4 } from "uuid";
import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  ObjectCannedACL,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { AppError } from "./classError";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const s3Client = () => {
  return new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });
};

export const uploadFile = async ({
  storeType = storageEnum.cloud,
  Bucket = process.env.BUCKET_NAME,
  ACL = "private" as ObjectCannedACL,
  path = "general",
  file,
}: {
  storeType?: storageEnum;
  Bucket?: string;
  ACL?: ObjectCannedACL;
  path: string;
  file: Express.Multer.File;
}): Promise<string> => {
  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME!,
    ACL,
    Key: `${process.env.APPLICATION_NAME}/${path}/${uuidv4()}_${
      file.originalname
    }`,
    Body:
      storeType === storageEnum.cloud
        ? file.buffer
        : createReadStream(file.path),
    ContentType: file.mimetype,
  });
  await s3Client().send(command);
  return command.input.Key!;
};

export const uploadLargeFile = async ({
  storeType = storageEnum.cloud,
  Bucket = process.env.BUCKET_NAME,
  ACL = "private" as ObjectCannedACL,
  path = "general",
  file,
}: {
  storeType?: storageEnum;
  Bucket?: string;
  ACL?: ObjectCannedACL;
  path: string;
  file: Express.Multer.File;
}) => {
  const upload = new Upload({
    client: new S3Client(),
    params: {
      Bucket: process.env.BUCKET_NAME!,
      ACL,
      Key: `${process.env.APPLICATION_NAME}/${path}/${uuidv4()}_${
        file.originalname
      }`,
      Body:
        storeType === storageEnum.cloud
          ? file.buffer
          : createReadStream(file.path),
      ContentType: file.mimetype,
    },
  });
  const { Key } = await upload.done();
  if (!Key) {
    throw new AppError("failed to upload please try again");
  }
  return Key;
};

export const uploadFiles = async ({
  storeType = storageEnum.cloud,
  Bucket = process.env.BUCKET_NAME,
  ACL = "private" as ObjectCannedACL,
  path = "general",
  files,
  large = false,
}: {
  storeType?: storageEnum;
  Bucket?: string;
  ACL?: ObjectCannedACL;
  path: string;
  files: Express.Multer.File[];
  large?: boolean;
}) => {
  let keys = [];
  if (large == true) {
    keys = await Promise.all(
      files.map((file) => uploadLargeFile({ file: file, path }))
    );
  } else {
    keys = await Promise.all(
      files.map((file) => uploadFile({ file: file, path }))
    );
  }
  return keys;
};

export const uploadWithSignedUrl = async ({
  Bucket = process.env.BUCKET_NAME!,
  path = "general",
  ContentType,
  originalName,
}: {
  Bucket?: string;
  originalName: string;
  path: string;
  ContentType: string;
}) => {
  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME!,
    ContentType,
    Key: `${process.env.APPLICATION_NAME}/${path}/${uuidv4()}/${originalName}`,
  });
  const url = await getSignedUrl(s3Client(), command, { expiresIn: 60 * 60 }); // in min
  return url;
};

export const getFile = async ({
  Bucket = process.env.BUCKET_NAME!,
  Key,
}: {
  Bucket?: string;
  Key: string ;
}) => {
  const command = new GetObjectCommand({
    Bucket,
    Key
  })
  return await s3Client().send(command);
};
export const getPreSignedURL = async ({
  Bucket = process.env.BUCKET_NAME!,
  Key,
  downloadName
}: {
  Bucket?: string
  Key: string
  downloadName?:string | undefined
}) => {
  const command = new GetObjectCommand({
    Bucket,
    Key,
     ...(downloadName
      ? {
          ResponseContentDisposition: `attachment; filename="${downloadName}"`,
        }
      : {
          ResponseContentDisposition: "inline",
        }),
  })
  const url = await getSignedUrl(s3Client() , command , {expiresIn:60});
  return url;

};
export const deleteFile = async({
  Bucket = process.env.BUCKET_NAME!,
  Key,
}:{
  Bucket ?:string,
  Key :string,
} )=>{

  const command = new DeleteObjectCommand({
    Bucket,
    Key
  })
  await s3Client().send(command);

}
export const deleteFiles = async({
  Bucket = process.env.BUCKET_NAME!,
  urls,
  Quiet=false
}:{
  Bucket ?:string,
  urls :string[],
  Quiet?:boolean
} )=>{

  const command = new DeleteObjectsCommand({
    Bucket,
    Delete:{
      Objects:urls.map( url =>({ Key: url})),
       Quiet
    },
   
    
  })
  return await s3Client().send(command);

}


export const listFiles =async({
  Bucket = process.env.BUCKET_NAME!,
  path 
}:{
  Bucket?:string,
  path:string
} )=>{

  const command = new ListObjectsV2Command({
    Bucket,
    Prefix:`${process.env.APPLICATION_NAME}/${path}`
  })
  return await s3Client().send(command);

}