const Vehicle = require("../models/Vehicle");

async function addVehicle(req, res) {

    try {

        const vehicle = new Vehicle(req.body);

        await vehicle.save();

        res.status(201).json({
            message: "Vehicle Added Successfully",
            vehicle: vehicle
        });

    } catch (error) {

        res.status(500).json({
            message: "Server Error"
        });

    }

}

async function getAllVehicles(req, res) {

    try {

        const vehicles = await Vehicle.find();

        res.status(200).json(vehicles);

    } catch (error) {

        res.status(500).json({
            message: "Server Error"
        });

    }

}

async function getVehicleById(req, res) {

    try {

        const vehicle = await Vehicle.findById(req.params.id);

        if (!vehicle) {
            return res.status(404).json({
                message: "Vehicle Not Found"
            });
        }

        res.status(200).json(vehicle);

    } catch (error) {

        res.status(500).json({
            message: "Server Error"
        });

    }

}

async function updateVehicle(req, res) {

    try {

        const vehicle = await Vehicle.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!vehicle) {
            return res.status(404).json({
                message: "Vehicle Not Found"
            });
        }

        res.status(200).json({
            message: "Vehicle Updated Successfully",
            vehicle: vehicle
        });

    } catch (error) {

        res.status(500).json({
            message: "Server Error"
        });

    }

}

async function deleteVehicle(req, res) {

    try {

        const vehicle = await Vehicle.findByIdAndDelete(req.params.id);

        if (!vehicle) {
            return res.status(404).json({
                message: "Vehicle Not Found"
            });
        }

        res.status(200).json({
            message: "Vehicle Deleted Successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: "Server Error"
        });

    }

}

module.exports = {
    addVehicle,
    getAllVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle
};