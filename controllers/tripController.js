const Trip = require("../models/Trip");
const Vehicle = require("../models/Vehicle");
const Driver = require("../models/Driver");

async function createTrip(req, res) {

    try {

        const trip = new Trip(req.body);

        await trip.save();

        if (trip.status === "Dispatched") {

            await Vehicle.findByIdAndUpdate(
                trip.vehicle,
                {
                    status: "On Trip"
                }
            );

            await Driver.findByIdAndUpdate(
                trip.driver,
                {
                    status: "On Trip"
                }
            );

        }

        res.status(201).json({

            message: "Trip Created Successfully",

            trip

        });

    } catch (error) {

        res.status(500).json({

            message: "Server Error"

        });

    }

}

async function getAllTrips(req, res) {

    try {

        const trips = await Trip.find()
            .populate("vehicle")
            .populate("driver");

        res.status(200).json(trips);

    } catch (error) {

        res.status(500).json({

            message: "Server Error"

        });

    }

}

async function getTripById(req, res) {

    try {

        const trip = await Trip.findById(req.params.id)
            .populate("vehicle")
            .populate("driver");

        if (!trip) {

            return res.status(404).json({

                message: "Trip Not Found"

            });

        }

        res.status(200).json(trip);

    } catch (error) {

        res.status(500).json({

            message: "Server Error"

        });

    }

}

async function updateTrip(req, res) {

    try {

        const trip = await Trip.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!trip) {

            return res.status(404).json({

                message: "Trip Not Found"

            });

        }

        if (trip.status === "Completed") {

            await Vehicle.findByIdAndUpdate(
                trip.vehicle,
                {
                    status: "Available"
                }
            );

            await Driver.findByIdAndUpdate(
                trip.driver,
                {
                    status: "Available"
                }
            );

        }

        if (trip.status === "Dispatched") {

            await Vehicle.findByIdAndUpdate(
                trip.vehicle,
                {
                    status: "On Trip"
                }
            );

            await Driver.findByIdAndUpdate(
                trip.driver,
                {
                    status: "On Trip"
                }
            );

        }

        res.status(200).json({

            message: "Trip Updated Successfully",

            trip

        });

    } catch (error) {

        res.status(500).json({

            message: "Server Error"

        });

    }

}

async function deleteTrip(req, res) {

    try {

        const trip = await Trip.findByIdAndDelete(req.params.id);

        if (!trip) {

            return res.status(404).json({

                message: "Trip Not Found"

            });

        }

        res.status(200).json({

            message: "Trip Deleted Successfully"

        });

    } catch (error) {

        res.status(500).json({

            message: "Server Error"

        });

    }

}

module.exports = {

    createTrip,

    getAllTrips,

    getTripById,

    updateTrip,

    deleteTrip

};