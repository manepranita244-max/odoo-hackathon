const Maintenance = require("../models/Maintenance");
const Vehicle = require("../models/Vehicle");

async function addMaintenance(req, res) {

    try {

        const maintenance = new Maintenance(req.body);

        await maintenance.save();

        await Vehicle.findByIdAndUpdate(
            req.body.vehicle,
            {
                status: "In Shop"
            }
        );

        res.status(201).json({

            message: "Maintenance Record Added Successfully",

            maintenance

        });

    } catch (error) {

        res.status(500).json({

            message: "Server Error"

        });

    }

}

async function getAllMaintenance(req, res) {

    try {

        const maintenance = await Maintenance.find()
            .populate("vehicle");

        res.status(200).json(maintenance);

    } catch (error) {

        res.status(500).json({

            message: "Server Error"

        });

    }

}

module.exports = {

    addMaintenance,

    getAllMaintenance

};