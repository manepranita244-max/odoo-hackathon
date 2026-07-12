const express = require("express");

const router = express.Router();

const driverController = require("../controllers/driverController");

const verifyToken = require("../middleware/authMiddleware");

const checkRole = require("../middleware/roleMiddleware");

router.post(
    "/add",
    verifyToken,
    checkRole("Admin"),
    driverController.addDriver
);

router.get(
    "/all",
    verifyToken,
    driverController.getAllDrivers
);

router.get(
    "/:id",
    verifyToken,
    driverController.getDriverById
);

router.put(
    "/:id",
    verifyToken,
    checkRole("Admin"),
    driverController.updateDriver
);

router.delete(
    "/:id",
    verifyToken,
    checkRole("Admin"),
    driverController.deleteDriver
);

module.exports = router;