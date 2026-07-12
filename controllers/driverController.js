const Driver = require("../models/Driver");

async function addDriver(req, res) {
    try {
        const driver = new Driver(req.body);
        await driver.save();

        res.status(201).json({
            message: "Driver Added Successfully",
            driver
        });

    } catch (error) {
        res.status(500).json({
            message: "Server Error"
        });
    }
}

async function getAllDrivers(req, res) {
    try {
        const drivers = await Driver.find();

        res.status(200).json(drivers);

    } catch (error) {
        res.status(500).json({
            message: "Server Error"
        });
    }
}

async function getDriverById(req, res) {
    try {

        const driver = await Driver.findById(req.params.id);

        if (!driver) {
            return res.status(404).json({
                message: "Driver Not Found"
            });
        }

        res.status(200).json(driver);

    } catch (error) {
        res.status(500).json({
            message: "Server Error"
        });
    }
}

async function updateDriver(req, res) {
    try {

        const driver = await Driver.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!driver) {
            return res.status(404).json({
                message: "Driver Not Found"
            });
        }

        res.status(200).json({
            message: "Driver Updated Successfully",
            driver
        });

    } catch (error) {
        res.status(500).json({
            message: "Server Error"
        });
    }
}

async function deleteDriver(req, res) {
    try {

        const driver = await Driver.findByIdAndDelete(req.params.id);

        if (!driver) {
            return res.status(404).json({
                message: "Driver Not Found"
            });
        }

        res.status(200).json({
            message: "Driver Deleted Successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Server Error"
        });
    }
}

module.exports = {
    addDriver,
    getAllDrivers,
    getDriverById,
    updateDriver,
    deleteDriver
};