import { Model, Document, Types } from "mongoose";

class DataQueryAbstraction<T extends Document> {
  constructor(private model: Model<T>) {}

  async find(query: object = {}, projection: object = {}) {
    try {
      return await this.model.find(query, projection);
    } catch (error: any) {
      throw new Error(`Error while finding documents: ${error.message}`);
    }
  }

  async findById(id: Types.ObjectId | string) {
    try {
      return await this.model.findById(id);
    } catch (error: any) {
      throw new Error(`Error findinf document ${error.message}`);
    }
  }

  async update(query: object, update: object) {
    try {
      await this.model.updateOne(query, update);
    } catch (error: any) {
      throw new Error(`Error updatign document ${error.message}`);
    }
  }

  async findOneAndUpdate(query: object, projection: object) {
    try {
      return await this.model.findOneAndUpdate(query, projection);
    } catch (error: any) {
      throw new Error(`Error while updating documents: ${error.message}`);
    }
  }

  async create(data: T) {
    try {
      return await this.model.create(data);
    } catch (error: any) {
      throw new Error(`Error while creatin document: ${error.message}`);
    }
  }

  async save(document: T) {
    try {
      return await document.save();
    } catch (error: any) {
      throw new Error(`Error saving the document ${error.message}`);
    }
  }

  async delete(query: object) {
    try {
      return await this.model.deleteOne(query);
    } catch (error: any) {
      throw new Error(`Error while deleting document: ${error.meaage}`);
    }
  }
}

export default DataQueryAbstraction;
