const { Router } = require("express");

const { createBus, 
    resetTickets} = require("../controllers/adminControllers");

const router = Router();

router.post("/", createBus)
router.put("/:id", resetTickets)