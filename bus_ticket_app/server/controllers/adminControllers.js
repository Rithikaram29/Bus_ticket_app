const Bus = require('../models/adminModel');

//creating the bus
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

//resetting the bus tickets
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

//get buses
const getBuses = async (req, res, next) => {
    try {
        const buses = await Bus.find();
        if (!buses) {
            res.status(404);
            return new Error("Could not find buses");
        }

        res.status(202).json(buses)
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createBus,
    resetTickets,
    getBuses
};