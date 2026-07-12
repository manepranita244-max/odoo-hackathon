const express = require("express");

const router = express.Router();

const driverController = require("../controllers/driverController");

router.post("/add", driverController.addDriver);

router.get("/all", driverController.getAllDrivers);

router.get("/:id", driverController.getDriverById);

router.put("/:id", driverController.updateDriver);

router.delete("/:id", driverController.deleteDriver);

module.exports = router;