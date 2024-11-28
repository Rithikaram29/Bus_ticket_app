import Bus from "../models/busModel";
import { UserRole } from "../models/userDetailModel";
import { Request, RequestHandler, Response } from "express";
import { Types } from "mongoose";

//interface structure
enum SeatType {
  SingleSleeper = "single sleeper",
  DoubleSleeper = "double sleeper",
  Seater = "seater",
}

interface SelectedSeat {
  seatNumber: string;
  name: string;
  phone: number;
  email: string;
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

interface CustomRequest extends Request {
  user: { _id: Types.ObjectId; email: string; role: string };
}

// To book tickets
const bookTicket: RequestHandler = async (
  req: CustomRequest,
  res: Response
) => {
  const busId = req.params.id; //assuming once we are directed to the bus page, the id is added in the params

  try {
    const currentBus = await Bus.findById(busId);

    if (!currentBus) {
      res.status(404).json({ error: "bus not found" });
      return;
    }

    const selectedSeats: SelectedSeat[] = req.body.seats; //req.body will contain object with key as seats and value as array of selected seats.
    //structure of the incoming req.body will be {seats:[{seatNo:"", name:"", phone:"", email:""},{seatNo:"", name:"", phone:"", email:""}]}

    //getting the seatnumber to be booked.
    const selectedSeatNumbers = selectedSeats.map((selSeat) => selSeat.seatNumber);

    //using the eselected seatnumber to check if that is already booked to avoid error
    const bookedSeats = currentBus
      ? currentBus.seats.filter(
          (seat) =>
            selectedSeatNumbers.includes(seat.seatNumber) &&
            seat.availability === false
        )
      : [];

    if (bookedSeats.length > 0) {
      res.status(404).json({
        error: "Some seats are already booked",
        seatNum: bookedSeats.map((seat) => seat.seatNumber),
      });
    } else {
      currentBus
        ? currentBus.seats.map((seat: Seat) => {
            if (selectedSeatNumbers.includes(seat.seatNumber)) {
              seat.availability = false;
              const matchingSeat = selectedSeats.filter(
                (selSeat) => selSeat.seatNumber === seat.seatNumber
              );
              if (matchingSeat.length > 0) {
                seat.assignedTo = {
                  name: matchingSeat[0].name,
                  email: matchingSeat[0].email,
                  phone: matchingSeat[0].phone,
                };
              }
            }
          })
        : [];
    }

    currentBus.save();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

//To cancel tickets

const cancelTicket: RequestHandler = async (
  req: CustomRequest,
  res: Response
) => {
  const busId = req.params.id; //assuming once we are directed to the bus page, the id is added in the params
  try {
    const currentBus = await Bus.findById(busId);

    if (!currentBus) {
      res.status(404).json({ error: "bus not found" });
    }

    const selectedSeats: SelectedSeat[] = req.body.seats; //req.body will contain object with key as seats and value as array of selected seats.
    //structure of the incoming req.body will be {seats:[{seatNo:"", name:"", phone:"", email:""},{seatNo:"", name:"", phone:"", email:""}]}

    //getting the seatnumber to be booked.
    const selectedSeatNumbers = selectedSeats.map((selSeat) => selSeat.seatNumber);

    //using the eselected seatnumber to check if that is already booked to avoid error
    const bookedSeats = currentBus
      ? currentBus.seats.filter(
          (seat) =>
            selectedSeatNumbers.includes(seat.seatNumber) &&
            seat.availability === true
        )
      : [];

    if (bookedSeats.length > 0) {
      res.status(404).json({
        error: "Some seats are not booked by you",
        seatNum: bookedSeats.map((seat) => seat.seatNumber),
      });
    } else {
      currentBus
        ? currentBus.seats.map((seat) => {
            if (selectedSeatNumbers.includes(seat.seatNumber)) {
              seat.availability = true;
            }
          })
        : [];
    }

    currentBus ? currentBus.save() : new Error("Cannot save canceled ticket");
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

//Get bus details
const getBusdetails: RequestHandler = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    if (req.user.role === UserRole.CUSTOMER) {
      const allBuses = await Bus.find({}, { "seats.assignedTo": 0 });
      res.status(400).json(allBuses);
    } else {
      res.status(500).json({ error: "Not Authorised!" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

export { bookTicket, cancelTicket, getBusdetails };
