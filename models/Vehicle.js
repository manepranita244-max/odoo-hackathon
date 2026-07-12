const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({

    registrationNumber: {
        type: String,
        required: true,
        unique: true
    },

    vehicleName: {
        type: String,
        required: true
    },

    vehicleType: {
        type: String,
        required: true
    },

    region: {
        type: String,
        required: true
    },

    maximumLoadCapacity: {
        type: Number,
        required: true
    },

    odometer: {
        type: Number,
        required: true
    },

    acquisitionCost: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        enum: [
            "Available",
            "On Trip",
            "In Shop",
            "Retired"
        ],
        default: "Available"
    }

});

module.exports = mongoose.model("Vehicle", vehicleSchema);