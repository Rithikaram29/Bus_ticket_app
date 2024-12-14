import Bus from "../models/busModel";
import { Request, RequestHandler, Response } from "express";
import { User, UserRole } from "../models/userDetailModel";
import { Types } from "mongoose";
import DateModel from "../models/calendarModel";
import DataQueryAbstraction from "../abstraction/databaseMethodAbstraction";


const busServices = new DataQueryAbstraction(Bus);
const userControl = new DataQueryAbstraction(User);
const calendarServices = new DataQueryAbstraction(DateModel);

interface CustomRequest extends Request {
  user?: { _id: Types.ObjectId; email: string; role: string };
}

//creating the bus
const createBus: RequestHandler = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const userId: any = req.user?._id;
    const role = req.user?.role;

    if (role !== UserRole.ADMIN) {
      res.status(403).json({ error: "Not Authorized" });
      return;
    }

    if (!userId) {
      res.status(400).json({ error: "User Does Not Exist!" });
      return;
    }

    // Check for existing bus
    const busNo = req.body.busno;
    if(!busNo){
      res.status(401).json({error: "Bus number is required!"});
      return;
    }
    const existingBus = await busServices.findOne({ busNo: req.body.busno });

    // const existingBus = allexistingBus[0]
    if (existingBus) {
      res.status(400).json({ error: "Bus already exists!" , Bus: existingBus });
      return;
    }

    // Create the new bus
    const newBus = await busServices.create(req.body);
    if (!newBus) {
      res.status(400).json({ error: "Cannot create Bus!" });
      return;
    }

    // Add bus to user
    const newBusId = newBus._id;
    await userControl.findOneAndUpdate(
      { _id: userId },
      { $push: { bus: newBusId } }
    );

    // Respond with the newly created bus
    res.status(201).json(newBus);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

//add bus to dates
const addBusToCalendarDates: RequestHandler = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { dates, busNo } = req.body;

    if (!Array.isArray(dates) || dates.length === 0 || !busNo) {
      res.status(400).json({ error: "Invalid or missing dates array or busNo." });
      return;
    }

    const calendarEntries = dates.map(async (date: string) => {
      const existingCalendar = await calendarServices.find({ date });

      if (existingCalendar.length > 0) {
        // Update existing calendar entry
        await calendarServices.update(
          { date },
          { $push: { bus: { busNo, bookedSeats: [] } } }
        );
      } else {
        // Create new calendar entry
        const newCalendar: any = {
          date,
          bus: [{ busNo, bookedSeats: [] }],
        };
        await calendarServices.create(newCalendar);
      }
    });

    await Promise.all(calendarEntries); // Ensure all calendar updates/creates are complete

    res.status(200).json({ message: "Bus ID added to selected dates." });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

//get calender with bus details
const getCalendarDetails: RequestHandler = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const userId: any = req.user?._id;
    const role = req.user?.role;

    // Check if the user is authorized
    if (role !== UserRole.ADMIN) {
      res.status(403).json({ error: "Not Authorized" });
      return;
    }

    if (!userId) {
      res.status(400).json({ error: "User Does Not Exist!" });
      return;
    }

    // Fetch calendar data with populated buses
    const calendar: any = await calendarServices.populate({}, { path: "bus" });

    // Fetch the current user with populated buses
    const currentUser: any = await userControl.populate(
      { _id: userId },
      { path: "bus" }
    );

    if (!currentUser) {
      res.status(404).json({ error: "Could not find User" });
      return;
    }

    const userBuses = currentUser.bus;
    console.log(currentUser)
    if (!userBuses || userBuses.length === 0) {
      res.status(404).json({ error: "No buses assigned to the user" });
      return;
    }

    // Extract bus numbers for comparison
    const userBusNumbers = userBuses.map((bus: any) => bus.busNo);

    // Filter calendar entries to include only those with matching buses
    const filteredCalendar = calendar.filter((entry: any) =>
      entry.bus.some((bus: any) => userBusNumbers.includes(bus.busNo))
    );


    res.status(200).json(filteredCalendar);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


//resetting the bus tickets
const resetTickets: RequestHandler = async (
  req: CustomRequest,
  res: Response
) => {
  const busId = req.params.id;
  const { date } = req.body;
  try {
    const currentDay: any = calendarServices.find({ date: date });

    if (!currentDay || currentDay.length === 0) {
      res.status(404).json({ error: "Date not found in the calendar." });
      return;
    }

    //buses for the day
    const buses = currentDay[0].bus;

    //Finding our bus
    const currentBus = buses.find((bus: any) => bus.busId.toString() === busId);

    if (!currentBus) {
      res.status(404).json({ error: "Could not find bus." });
      return;
    }

    currentBus.bookedSeats = [];

    await calendarServices.update(
      { date },
      { $set: { "bus.$[elem].bookSeats": [] } },
      { arrayFilters: [{ "elem.busId": busId }] }
    );

    res.status(200).json({ message: "Tickets reset successful." });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

//get buses
const getBuses: RequestHandler = async (req: CustomRequest, res: Response) => {
  try {
    let role: string | undefined = req.user?.role;

    if (role !== "admin") {
      res.status(403).json({ error: "Not Authorised!" });
      return;
    }

    const userId = req.user?._id;
    let currentUser: any = await userControl.populate({ _id: userId }, { path: "bus", model: "Bus" });

    console.log(currentUser[0])
    if (!currentUser) {
      res.status(404).json({ error: "Could not find User" });
      return;
    }

    const buses = currentUser[0].bus;
    console.log(buses)
    if (!buses) {
      res.status(404).json({ error: "Could not find buses" });
      return;
    }

    res.status(202).json(buses);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

//get bus detail for particular date
const getBusdetails: RequestHandler = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const role = req.user?.role;

  // Check if the user has admin privileges
  if (role !== "admin") {
    res.status(403).json({ error: "Not Authorised!" });
    return;
  }

  try {

    const busId = req.params.id;

    const bus = await busServices.populate({ _id: busId }, { path: "trips.bookedSeats.bookedBy", model: "User" });

    console.log(bus);

    res.status(200).json(bus);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


export { createBus, resetTickets, getBuses, getBusdetails, addBusToCalendarDates, getCalendarDetails };
