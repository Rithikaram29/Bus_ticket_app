const { Router } = require("express");

const { createBus,
    resetTickets,
    getBuses } = require("../controllers/adminControllers");

const router = Router();

router.get("/", getBuses);
router.post("/", createBus);
router.put("/:id", resetTickets);

module.exports = router;