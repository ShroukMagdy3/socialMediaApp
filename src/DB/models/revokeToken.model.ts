import mongoose, { Types } from "mongoose";

export interface IRevokeToken {
    tokenId:string,
    expAt:Date
    userId:Types.ObjectId
}


const revokeTokenSchema = new mongoose.Schema<IRevokeToken>(
  {
    tokenId:{type:String , required:true},
    userId:{ type:mongoose.Schema.Types.ObjectId , ref:"User"},
    expAt:{type:Date , required:true}
  }
);


const revokeTokenModel =
  mongoose.models.RevokeToken || mongoose.model<IRevokeToken>("RevokeToken", revokeTokenSchema);
  export default revokeTokenModel
