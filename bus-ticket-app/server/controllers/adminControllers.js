const Bus = require('../models/busModel');
const { UserRole } = require('../models/userDetailModel');

//creating the bus
const createBus = async (req, res) => {
    try {
        const newBus = await Bus.create(req.body)
        if (!newBus) {
            res.status(400);
            return new Error("Cannot creat bus")
        }

        return res.status(201).json(newBus);

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


//resetting the bus tickets
const resetTickets = async (req, res) => {
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
        res.status(500).json({ error: error.message })
    }

}

//get buses
const getBuses = async (req, res) => {
    try {
        if (req.user.role === UserRole.ADMIN) {
            const buses = await Bus.find();
            if (!buses) {
                res.status(404);
                return new Error("Could not find buses");
            }

            res.status(202).json(buses)
        } else {
            res.status(500).json({ error: "Not Auhtorised!" })
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = {
    createBus,
    resetTickets,
    getBuses
};