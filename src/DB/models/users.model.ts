import mongoose from "mongoose";

export interface IUser {
  fName: string;
  lName: string;
  userName?: string;
  gender: string;
  role?: string;
  password: string;
  email: string;
  age: number;
  phone?: string;
  address: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export enum genderType {
  male = "male",
  female = "female",
}
export enum roleType {
  user = "user",
  admin = "admin",
}

const userSchema = new mongoose.Schema<IUser>(
  {
    fName: { type: String, minLength: 2, maxlength: 10, trim: true },
    lName: { type: String, minLength: 2, maxlength: 10, trim: true },
    email: { type: String, unique: true, trim: true },
    gender: {
      type: String,
      enum: genderType,
      required: true,
    },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    age: { type: Number, min: 18, max: 60, required: true },
    role: { type: String, enum: roleType, default: roleType.user },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

userSchema
  .virtual("userName")
  .set(function (val) {
    const [fName, lName] = val.split(" ");
    this.set({ fName, lName });
  })
  .get(function () {
    return this.fName + " " + this.lName;
  });

const userModel =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);
  export default userModel;
