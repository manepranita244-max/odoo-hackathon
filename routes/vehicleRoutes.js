const express = require("express");

const router = express.Router();

const vehicleController = require("../controllers/vehicleController");

const verifyToken = require("../middleware/authMiddleware");

const checkRole = require("../middleware/roleMiddleware");

router.post(
    "/add",
    verifyToken,
    checkRole("Admin"),
    vehicleController.addVehicle
);

router.get(
    "/all",
    verifyToken,
    vehicleController.getAllVehicles
);

router.get(
    "/:id",
    verifyToken,
    vehicleController.getVehicleById
);

router.put(
    "/:id",
    verifyToken,
    checkRole("Admin"),
    vehicleController.updateVehicle
);

router.delete(
    "/:id",
    verifyToken,
    checkRole("Admin"),
    vehicleController.deleteVehicle
);

module.exports = router;