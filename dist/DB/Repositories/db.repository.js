"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbRepository = void 0;
class DbRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    async create(data) {
        return this.model.create(data);
    }
    async findOne(filter, select) {
        return this.model.findOne(filter);
    }
}
exports.DbRepository = DbRepository;
