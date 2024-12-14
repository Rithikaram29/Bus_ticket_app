import { Router } from "express";

import {
  createBus,
  resetTickets,
  getBuses,
  addBusToCalendarDates,
  getCalendarDetails,
  getBusdetails
} from "../controllers/adminControllers";

const router = Router();

router.get("/bus", getBuses);

router.get("/calendar", getCalendarDetails)
router.get("/bus/details/:id", getBusdetails)
router.post("/bus/create", createBus);
router.post("/bus/addtodate",addBusToCalendarDates)
router.put("/ticket-reset/:id", resetTickets);

export default router;
