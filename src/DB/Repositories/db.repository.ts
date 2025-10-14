import {
  DeleteResult,
  HydratedDocument,
  Model,
  ProjectionType,
  QueryOptions,
  RootFilterQuery,
  UpdateQuery,
  UpdateWriteOpResult,
} from "mongoose";

export class DbRepository<TDocument> {
  constructor(protected readonly model: Model<TDocument>) {}
  async create(data: Partial<TDocument>): Promise<HydratedDocument<TDocument>> {
    return await this.model.create(data);
  }

  async findOne(
    filter: RootFilterQuery<TDocument>,
    select?: ProjectionType<TDocument>
  ): Promise<HydratedDocument<TDocument> | null> {
    return await this.model.findOne(filter);
  }
    async find (
      filter: RootFilterQuery<TDocument>,
    projection?: ProjectionType<TDocument> , 
    options?:QueryOptions<TDocument>
  ):Promise<HydratedDocument<TDocument>[]>{
    return await this.model.find(filter , projection , options);
  }

  async updateOne(
    filter: RootFilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ): Promise<UpdateWriteOpResult | null> {
    return await this.model.updateOne(filter, update);
  }
   async findOneAndUpdate(
    filter: RootFilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
    option:QueryOptions<TDocument> | null = {new :true}
  ): Promise<UpdateWriteOpResult | null> {
    return await this.model.findOneAndUpdate(filter, update , option);
  }
   async deleteOne(
    filter: RootFilterQuery<TDocument>, 
  ): Promise<DeleteResult | null> {
    return await this.model.deleteOne(filter);
  }




}
