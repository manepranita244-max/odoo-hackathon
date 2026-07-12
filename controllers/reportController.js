const Fuel = require("../models/Fuel");
const Expense = require("../models/Expense");
const Maintenance = require("../models/Maintenance");
const Vehicle = require("../models/Vehicle");
const Trip = require("../models/Trip");

async function getReport(req, res) {

    try {

        const totalFuelCost = await Fuel.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$cost" }
                }
            }
        ]);

        const totalExpense = await Expense.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" }
                }
            }
        ]);

        const totalMaintenance = await Maintenance.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$cost" }
                }
            }
        ]);

        const totalVehicles = await Vehicle.countDocuments();

        const totalTrips = await Trip.countDocuments();

        res.status(200).json({

            totalVehicles,

            totalTrips,

            totalFuelCost: totalFuelCost[0]?.total || 0,

            totalExpense: totalExpense[0]?.total || 0,

            totalMaintenance: totalMaintenance[0]?.total || 0

        });

    } catch (error) {

        res.status(500).json({

            message: "Server Error"

        });

    }

}

module.exports = {

    getReport

};