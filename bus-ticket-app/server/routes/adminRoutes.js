const { Router } = require("express");

const { createBus,
    resetTickets,
    getBuses } = require("../controllers/adminControllers");

const router = Router();


router.get("/bus", getBuses);
router.post("/bus/create", createBus);
router.put("/ticket-reset/:id", resetTickets);

module.exports = router;