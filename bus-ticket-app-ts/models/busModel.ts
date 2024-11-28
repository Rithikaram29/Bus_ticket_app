import mongoose, { Model, Document, Schema } from "mongoose";

//TypeScript interfaces for Schemas
enum SeatType {
  SingleSleeper = "single sleeper",
  DoubleSleeper = "double sleeper",
  Seater = "seater",
}

interface Seat {
  seatNumber: string;
  availability: boolean;
  seatType: SeatType;
  seatPrice: number;
  assignedTo: {
    name: string;
    email: string;
    phone: number;
  };
}

interface Pickup {
  city: string;
  landmark: string[];
}

interface Drop {
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

//Mongoose Schemas
const seatSchema = new Schema<Seat>({
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
    default: SeatType.Seater,
  },
  seatPrice: {
    type: Number,
    required: true,
  },
  assignedTo: {
    name: {
      type: String,
      required: function () {
        return !this.availability;
      },
    },
    email: {
      type: String,
      required: function () {
        return !this.availability;
      },
    },
    phone: {
      type: Number,
      required: function () {
        return !this.availability;
      },
    },
  },
});

const pickupSchema = new Schema<Pickup>({
  city: {
    type: String,
    required: true,
  },
  landmark: [String],
});

const dropSchema = new Schema<Drop>({
  city: {
    type: String,
    required: true,
  },
  landmark: [String],
});

const busSchema = new Schema<Bus>({
  name: {
    type: String,
    required: true,
  },
  pickup: [pickupSchema],
  drop: [dropSchema],
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
  seats: [seatSchema],
});

const Busmodel: Model<Bus> = mongoose.model("Bus", busSchema);

export default Busmodel;
