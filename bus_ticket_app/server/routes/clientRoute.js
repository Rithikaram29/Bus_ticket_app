const {Router} = require("express");

const { bookTicket,
    cancelTicket,
    getBusdetails} = require("../controllers/clientController");

    const router = Router();

    router.get("/", getBusdetails);
    router.put("/book/:id",bookTicket);
    router.put("/cancel/:id",cancelTicket);

    module.exports = router;