import { config } from "dotenv";
import path, { resolve } from "path";
config({ path: resolve("./config/.env") });

import { pipeline } from "stream";
import { promisify } from "util";

const writePipeLine = promisify(pipeline);
import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { AppError } from "./utilities/classError";
import userRouter from "./modules/users/users.controller";
import { connectionDB } from "./DB/connectionDB";
import { deleteFile, deleteFiles, getFile, getPreSignedURL, listFiles } from "./utilities/s3.config";
import { getSignature } from "./utilities/token";
import { createReadStream } from "fs";
const app: express.Application = express();
const port: string | number = process.env.PORT || 5000;
const limiter = rateLimit({
  max: 10,
  windowMs: 5 * 60 * 1000,
  message: {
    error: "too many requests",
  },
  statusCode: 429,
  legacyHeaders: false,
});


const bootstrap = async() => {
  app.use(express.json());
  app.use(helmet());
  app.use(cors());
  app.use(limiter);
  app.use("/api/user" ,userRouter);




  app.get("/", (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({ message: "welcome to my socialApp" });
  });

  
  app.get("/getFileOrDownload/*path" , async( req: Request,
    res: Response,
    next: NextFunction)=>{      
        const { path } = req.params as unknown as { path: string[] };          
          const { downloadName } = req.query as unknown as { downloadName: string };
          // route => array ["socialApp" ,"users" ," " ]
          // array => string /socialApp/users/..
          const Key = path.join("/");
          const result = await getFile({
            Key
          });
          const stream = result.Body as NodeJS.ReadableStream;
          res.setHeader("Content-Type", result.ContentType || "application/octet-stream");
          res.setHeader("Content-Transfer-Encoding", "binary");
          if (downloadName) {
            res.setHeader(
              "Content-Disposition",
              `attachment; filename="${
                downloadName || Key.split("/").pop()
              }"`
            );
          }else{
        res.setHeader("Content-Disposition", "inline");
          }
          await writePipeLine(stream, res);
  })


app.get("/signedURL/getFileOrDownload/*path", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { path } = req.params as unknown as { path: string[] };
    const { downloadName } = req.query as unknown as { downloadName?: string };

    const Key = path.join("/");
    const url = await getPreSignedURL({
      Key,
      downloadName: downloadName || undefined,
    });

    res.status(200).json({ message: "success", url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "error", error });
  }
});

app.get("/delete/*path" ,async (req: Request, res: Response, next: NextFunction)=>{

  const {path} = req.params as unknown as {path:string[]};
  const Key = path.join("/");

  const result = await deleteFile({
    Key
  })
  return res.status(200).json({message:"deleted" , result})

})



app.get("/deleteFiles" ,async (req: Request, res: Response, next: NextFunction)=>{
  const result = await deleteFiles({
    urls:[
     "socialMediaApp/users/68cde91d4dc1e21b8c982a76/coverImages/14ba38e5-0aad-4b74-8b71-d7a7dfc9150f_team1.jpg",
     "socialMediaApp/users/68cde91d4dc1e21b8c982a76/coverImages/232bc74e-57fe-4ff6-9f8e-77f27fab9529_livingroom2.jpg"
    ],
    Quiet:true
  })
  return res.status(200).json({message:"deleted" , result})

})

app.get("/listFiles" ,async (req: Request, res: Response, next: NextFunction)=>{
  const result = await listFiles({
   path:`users/68cde91d4dc1e21b8c982a76/`
  })
  return res.status(200).json({message:"deleted" , result})

})




  await connectionDB();
  app.use("{/*demo}", (req: Request, res: Response, next: NextFunction) => {
   throw new AppError(`404 not found URL ,Invalid URL ${req.originalUrl}` , 404);
  });
  app.use((err :Error ,req: Request, res: Response, next: NextFunction)=>{
    return res.status(err.cause as unknown as number || 500).json({message :err.message , stack :err.stack})
  })
  app.listen(port, () => {
    console.log(`server is running on ${port}`);
  });
};


export default bootstrap;
