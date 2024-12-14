import Bus from "../models/busModel";
import { User, UserRole } from "../models/userDetailModel";
import { Request, RequestHandler, Response } from "express";
import { Types } from "mongoose";
import DataQueryAbstraction from "../abstraction/databaseMethodAbstraction";
import DateModel from "../models/calendarModel";

const busServices = new DataQueryAbstraction(Bus);
const userControl = new DataQueryAbstraction(User);
const dateControl = new DataQueryAbstraction(DateModel);

//interface structure
enum SeatType {
  SingleSleeper = "single sleeper",
  DoubleSleeper = "double sleeper",
  Seater = "seater",
}

interface SelectedSeat {
  seatNumber: string;
  userid: Types.ObjectId;
}

interface Seat {
  seatNumber: string;
  availability: boolean;
  seatType: SeatType;
  seatPrice: number;
  assignedTo: Types.ObjectId | undefined;
}

interface CustomRequest extends Request {
  user?: { _id: Types.ObjectId; email: string; role: string };
}

// To book tickets
const bookTicket = async (req: CustomRequest, res: Response) => {
 
  const busno = req.params.id; 
  const {date,seats} = req.body;
  const userId: any = req.user?._id;
  const role = req.user?.role;
  if (role !== UserRole.CUSTOMER) {
    throw new Error("Not Authorised");
  }
  try {
    //check for user
    const currentUser: any = await userControl.findById(userId);
    if (!currentUser) {
      res.status(404).json({ error: "User not found!" });
      return;
    }

    //check for bus
    const currentBus: any = await busServices.findOne({busno: busno});
    if (!currentBus) {
      res.status(404).json({ error: "bus not found" });
      return;
    }

    // Parse and filter trips for the given date
    const parsedDate = new Date(date);
    parsedDate.setHours(0, 0, 0, 0); // Set to midnight
    const nextDay = new Date(parsedDate);
    nextDay.setDate(parsedDate.getDate() + 1);

    const trip = currentBus.trips.find((trip: any) => {
      return (
        trip.pickupDateTime >= parsedDate &&
        trip.pickupDateTime < nextDay
      );
    });

    if (!trip) {
      res.status(404).json({ error: "No trips found for the selected date" });
      return;
    }
    
    // Ensure `bookedSeats` array exists in the trip
    if (!trip.bookedSeats) {
      trip.bookedSeats = [];
    }

   // Extract customer seat details
    const customerSeats = seats; // { seats: [{ seatNo: "", name: "" }] }
    const customerSeatNumbers = customerSeats.map((seat: any) => seat.seatNo);

     // Check if any of the requested seats are already booked
     const alreadyBookedSeats = trip.bookedSeats.filter((seat: any) =>
      customerSeatNumbers.includes(seat.SeatNumber)
    );

    //using the selected seatnumber to check if that is already booked to avoid error
    if (alreadyBookedSeats.length > 0) {
      res.status(400).json({
        error: "Some seats are already booked",
        seatNumbers: alreadyBookedSeats.map((booked: any) => booked.seatNumber),
      });
      return;
    }

     // Update `bookedSeats` in the bus model
    const newBookedSeats = customerSeats.map((seat: any) => ({
      SeatNumber: seat.seatNo,
      assignedTo: seat.name,
      bookedBy: userId,
    }));
    trip.bookedSeats.push(...newBookedSeats);

    // Add ticket details to the user's `tickets`
    const newTicket = {
      busNo: busno,
      seats: customerSeats.map((seat: any) => ({
        seatNo: seat.seatNo,
        name: seat.name,
      })),
    };

    if (!currentUser.tickets) {
      currentUser.tickets = [];
    }
    currentUser.tickets.push(newTicket);

    // Save updates to the bus and user models
    await currentBus.save();
    await currentUser.save();

    res.status(200).json({ message: "Tickets booked successfully!", currentBus,currentUser });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

//To cancel tickets

const cancelTicket = async (req: CustomRequest, res: Response) => {
  const busId = req.params.id; //assuming once we are directed to the bus page, the id is added in the params
  const userId: any = req.user?._id;
  const role = req.user?.role;
  if (role !== UserRole.CUSTOMER) {
    throw new Error("Not Authorised");
  }
  try {
    const currentBus: any = await busServices.findById(busId);

    if (!currentBus) {
      res.status(404).json({ error: "bus not found" });
    }

    const customerSeats: SelectedSeat[] = req.body.seats; //req.body will contain object with key as seats and value as array of selected seats.
    //structure of the incoming req.body will be {seats:[{seatNo:"", name:"", phone:"", email:""},{seatNo:"", name:"", phone:"", email:""}]}

    //getting the seatnumber to be booked.
    const customerSeatNumbers = customerSeats.map(
      (selSeat: any) => selSeat.seatNumber
    );

    //using the eselected seatnumber to check if that is already booked to avoid error
    const notBookedSeats = currentBus
      ? currentBus.seats.filter(
          (seat: any) =>
            customerSeatNumbers.includes(seat.seatNumber) &&
            seat.availability === true
        )
      : [];

    if (notBookedSeats.length > 0) {
      res.status(404).json({
        error: "Some seats are not booked by you",
        seatNum: notBookedSeats.map((seat: any) => seat.seatNumber),
      });
      return;
    } else {
      currentBus
        ? currentBus.seats.map((seat: any) => {
            if (customerSeatNumbers.includes(seat.seatNumber)) {
              (seat.availability = true), (seat.assignedTo = undefined);
            }
          })
        : [];
    }

    busServices.save(currentBus);

    res.status(200).json({ message: "Tickets canceled successfully!" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

//Get bus details
const getBusdetails: RequestHandler = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    // Extract query parameters
    const { from, to, date } = req.query;

    // Validate input parameters
    if (!date || !from || !to) {
      res
        .status(400)
        .json({ error: "Missing required parameters: date, from, or to." });
      return;
    }

    // Parse the date string to a Date object and set time to midnight
    const parsedDate = new Date(date as string);
    parsedDate.setHours(0, 0, 0, 0); // Set time to midnight of the given date

    // Create a query range for the date (from midnight to just before the next day)
    const nextDay = new Date(parsedDate);
    nextDay.setDate(parsedDate.getDate() + 1); // Set nextDay to the same time but the following day

    // Find buses based on the date range and the pickup/drop locations
    const buses = await busServices.find({
      trips: {
        $elemMatch: {
          pickuplocation: from,
          dropLocation: to,
          pickupDateTime: {
            $gte: parsedDate,   // Greater than or equal to the start of the day
            $lt: nextDay,       // Less than the start of the next day
          },
        },
      },
    });

    if (buses.length === 0) {
      res
        .status(404)
        .json({ error: "No buses available for the selected route." });
      return;
    }

    // Return the updated list of buses with seat availability
    res.status(200).json(buses);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export { bookTicket, cancelTicket, getBusdetails };
