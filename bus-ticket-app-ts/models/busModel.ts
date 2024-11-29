import mongoose, { Model } from "mongoose";
import SchemaAbstraction from "../abstraction/modelAbstraction";

const schemaAbstraction = new SchemaAbstraction();
//interface
interface AssignedTo {
  name: string;
  email: string;
  phone: number;
}

interface Seat extends Document {
  seatNumber: string;
  availability: boolean;
  seatType: SeatType;
  seatPrice: number;
  assignedTo: AssignedTo;
}

interface Pickup extends Document {
  city: string;
  landmark: string[];
}

interface Drop extends Document {
  city: string;
  landmark: string[];
}

interface Bus extends Document {
  name: string;
  pickup: Pickup[];
  drop: Drop[];
  bustype: string;
  isAc: boolean;
  rating: number;
  seats: Seat[];
}

enum SeatType {
  SingleSleeper = "single sleeper",
  DoubleSleeper = "double sleeper",
  Seater = "seater",
}

//Define seat Schema
schemaAbstraction.defineSchema("Seat", {
  seatNumber: {
    type: String,
    required: true,
  },
  availability: {
    type: Boolean,
    default: true,
  },
  seatType: {
    type: String,
    enum: Object.values(SeatType),
    default: SeatType.Seater,
  },
  seatPrice: {
    type: Number,
    required: true,
  },
  assignedTo: {
    name: {
      type: String,
      validate: {
        validator: function (this: any, value: string) {
          return this.availability || !!value;
        },
        message: "Name is required if the seat is unavailable",
      },
    },
    email: {
      type: String,
      validate: {
        validator: function (this: any, value: string) {
          return this.availability || !!value;
        },
        message: "Email is required if the seat is unavailable",
      },
    },
    phone: {
      type: Number,
      validate: {
        validator: function (this: any, value: string) {
          return this.availability || !!value;
        },
        message: "Phone number is required if the seat is unavailable",
      },
    },
  },
});

schemaAbstraction.defineSchema("Pickup", {
  city: {
    type: String,
    required: true,
  },
  landmark: [String],
});

schemaAbstraction.defineSchema("Drop", {
  city: {
    type: String,
    required: true,
  },
  landmark: [String],
});

schemaAbstraction.defineSchema("Bus", {
  name: {
    type: String,
    required: true,
  },
  pickup: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pickup" }],
  drop: [{ type: mongoose.Schema.Types.ObjectId, ref: "Drop" }],
  bustype: {
    type: String,
    required: true,
  },
  isAc: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 0,
  },
  seats: [{ type: mongoose.Schema.Types.ObjectId, ref: "Seat" }],
});

const BusModel: any = schemaAbstraction.getModel("Bus");

export default BusModel;
