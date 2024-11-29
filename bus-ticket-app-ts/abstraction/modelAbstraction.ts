import mongoose, { Schema, Document, Model, SchemaDefinitionProperty } from "mongoose";

interface ISchemaDefinition {
  [key: string]: any;
}


class SchemaAbstraction {
  private models: Map<string, Model<any>>;

  constructor() {
    this.models = new Map();
  }

  defineSchema<T extends Document>(
    name: string,
    schemaDefinition: { [path: string]: SchemaDefinitionProperty<any> }
  ): Model<T> {
    if (this.models.has(name)) {
      throw new Error(`Model ${name} already exists`);
    }

    //creating Schema and model
    const schema = new Schema(schemaDefinition);
    const model = mongoose.model<T>(name, schema);

    this.models.set(name,model);
    return model;
  }
  getModel<T extends Document>(name: string): Model<T> {
      const model = this.models.get(name);

      if(!model){
        throw new Error(`Model ${name} not found.`);
      }
      return model;
  }
}

export default SchemaAbstraction;