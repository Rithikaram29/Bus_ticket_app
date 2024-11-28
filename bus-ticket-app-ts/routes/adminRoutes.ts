import { Router } from "express";

import {
  createBus,
  resetTickets,
  getBuses,
} from "../controllers/adminControllers";

const router = Router();

router.get("/bus", getBuses);
router.post("/bus/create", createBus);
router.put("/ticket-reset/:id", resetTickets);

export default router;
