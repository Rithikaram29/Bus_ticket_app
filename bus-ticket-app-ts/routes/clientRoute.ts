import { Router } from "express";

import {
  bookTicket,
  cancelTicket,
  getBusdetails,
} from "../controllers/clientController";

const router = Router();

router.get("/bus", getBusdetails);
router.put("/book-ticket/:id", bookTicket);
router.put("/cancel-ticket/:id", cancelTicket);

export default router;
