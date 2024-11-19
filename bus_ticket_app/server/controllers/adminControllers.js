const Bus = require('../models/adminModel');

//createing the bus
const createBus = async (req, res, next) => {
    try {
        const newBus = await Bus.create(req.body)
        if (!busTicket) {
            res.status(400);
            return new Error("Cannot creat bus")
        }

        return res.status(201).json(newBus);

    } catch (error) {
        next(error)
    }
}

//resetting the bus
const resetTickets = async (req, res, next) => {
    const busId = req.params.id
    try {
        const resetBus = await Bus.findByIdAndUpdate(
            busId, { $set: { "seats.$[].availability": true } })

        if (!resetBus) {
            res.status(400);
            return new Error("Cannot reset bus")
        }

        res.status(202).json(resetBus);
    } catch (error) {
        next(error)
    }

}

module.exports = {
    createBus, 
    resetTickets
};