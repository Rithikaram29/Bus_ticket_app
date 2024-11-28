import Bus from "../models/busModel";
import { Request, RequestHandler, Response } from "express";
import { UserRole } from "../models/userDetailModel";
import { Types } from "mongoose";

interface CustomRequest extends Request {
  user: { _id: Types.ObjectId; email: string; role: string };
}

//creating the bus
const createBus: RequestHandler = async (req: CustomRequest, res: Response) => {
  try {
    const newBus = await Bus.create(req.body);
    if (!newBus) {
      res.status(400).json({ error: "Cannot create Bus!" });
    }

    res.status(201).json(newBus);
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
  try {
    const resetBus = await Bus.findByIdAndUpdate(busId, {
      $set: { "seats.$[].availability": true },
    });

    if (!resetBus) {
      res.status(400).json({ error: "Cannot reset bus" });
      return;
    }

    res.status(202).json(resetBus);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

//get buses
const getBuses: RequestHandler = async (req: CustomRequest, res: Response) => {
  try {
    if (req.user.role === UserRole.ADMIN) {
      const buses = await Bus.find();
      if (!buses) {
        res.status(404).json({ error: "Could not find buses" });
        return;
      }

      res.status(202).json(buses);
    } else {
      res.status(403).json({ error: "Not Authorised!" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export { createBus, resetTickets, getBuses };
