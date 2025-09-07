import mongoose from "mongoose";

export const connectionDB = () => {
  mongoose
    .connect(process.env.LINKDB as unknown as string)
    .then(() => {
      console.log(`successful connection to DB`);
    })
    .catch((err) => {
      console.log(`error in connection to DB ${err}`);
    });
};
