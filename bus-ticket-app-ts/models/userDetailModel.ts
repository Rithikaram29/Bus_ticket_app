import mongoose, { Model, Document, Schema } from "mongoose";

enum UserRole {
  ADMIN = "admin",
  CUSTOMER = "customer",
}

type UserRoleType = keyof typeof UserRole;

//interface for typeScript
interface NewUser extends Document {
  userName: string;
  phone: number;
  email: string;
  password: string;
  role: UserRole;
  name?: string;
}

const userDetails = new Schema<NewUser>({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.CUSTOMER,
  },

  name: { type: String },
});

const User: Model<NewUser> = mongoose.model("User", userDetails);

export { User, UserRole };
