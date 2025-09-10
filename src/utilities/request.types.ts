import { IUser } from '../DB/models/users.model';
import { JwtPayload } from 'jsonwebtoken';
import { HydratedDocument } from 'mongoose';

// merging => override 
declare module 'express-serve-static-core'{
    interface Request{
        user:HydratedDocument<IUser>,
        decoded:JwtPayload
    }
}