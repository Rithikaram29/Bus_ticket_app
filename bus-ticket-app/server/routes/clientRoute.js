const {Router} = require("express");


const { bookTicket,
    cancelTicket,
    getBusdetails} = require("../controllers/clientController");

    const router = Router();

    router.get("/bus", getBusdetails);
    router.put("/book-ticket/:id",bookTicket);
    router.put("/cancel-ticket/:id",cancelTicket);

    module.exports = router;