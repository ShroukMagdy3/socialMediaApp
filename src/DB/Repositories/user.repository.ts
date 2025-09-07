import { HydratedDocument, Model } from "mongoose";
import { IUser } from "./../models/users.model";
import { DbRepository } from "./db.repository";
import { AppError } from "../../utilities/classError";

export class UserRepository extends DbRepository<IUser> {
  constructor(protected readonly model: Model<IUser>) {
    super(model);
  }

  async createOneUser(data: Partial<IUser>): Promise<HydratedDocument<IUser>> {
    const user: HydratedDocument<IUser> = await this.model.create(data);
    if (!user) {
      throw new AppError("fail to create");
    }
    return user;
  }
}
