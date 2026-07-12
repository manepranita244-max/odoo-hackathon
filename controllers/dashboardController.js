const Vehicle = require("../models/Vehicle");
const Driver = require("../models/Driver");
const Trip = require("../models/Trip");

async function getKpis(req, res) {
    try {
        const filter = {};

        if (req.query.vehicleType) {
            filter.vehicleType = req.query.vehicleType;
        }

        if (req.query.status) {
            filter.status = req.query.status;
        }

        if (req.query.region) {
            filter.region = req.query.region;
        }

        const activeVehicles = await Vehicle.countDocuments({
            ...filter,
            status: "On Trip"
        });

        const availableVehicles = await Vehicle.countDocuments({
            ...filter,
            status: "Available"
        });

        const vehiclesInMaintenance = await Vehicle.countDocuments({
            ...filter,
            status: "In Shop"
        });

        const activeTrips = await Trip.countDocuments({
            status: "Dispatched"
        });

        const pendingTrips = await Trip.countDocuments({
            status: "Draft"
        });

        const completedTrips = await Trip.countDocuments({
            status: "Completed"
        });

        const driversOnDuty = await Driver.countDocuments({
            status: "On Trip"
        });

        const totalVehicles = await Vehicle.countDocuments(filter);

        const fleetUtilization = totalVehicles === 0
            ? 0
            : ((activeVehicles / totalVehicles) * 100).toFixed(2);

        res.json({
            activeVehicles,
            availableVehicles,
            vehiclesInMaintenance,
            activeTrips,
            pendingTrips,
            completedTrips,
            driversOnDuty,
            fleetUtilization
        });
    } catch (error) {
        res.status(500).json({
            message: "Server Error"
        });
    }
}

async function getVehicleStatusBreakdown(req, res) {
    try {
        const statuses = ["Available", "On Trip", "In Shop", "Retired"];

        const breakdown = await Promise.all(
            statuses.map(async (status) => ({
                _id: status,
                count: await Vehicle.countDocuments({ status })
            }))
        );

        res.json(breakdown);
    } catch (error) {
        res.status(500).json({
            message: "Server Error"
        });
    }
}

module.exports = {
    getKpis,
    getVehicleStatusBreakdown
};