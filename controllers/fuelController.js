const Fuel = require("../models/Fuel");

async function addFuel(req, res) {

    try {

        const fuel = new Fuel(req.body);

        await fuel.save();

        res.status(201).json({

            message: "Fuel Log Added Successfully",

            fuel

        });

    } catch (error) {

        res.status(500).json({

            message: "Server Error"

        });

    }

}

async function getAllFuel(req, res) {

    try {

        const fuel = await Fuel.find().populate("vehicle");

        res.status(200).json(fuel);

    } catch (error) {

        res.status(500).json({

            message: "Server Error"

        });

    }

}

module.exports = {

    addFuel,

    getAllFuel

};