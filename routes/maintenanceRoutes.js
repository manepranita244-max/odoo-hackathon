const express = require("express");

const router = express.Router();

const maintenanceController = require("../controllers/maintenanceController");

router.post("/add", maintenanceController.addMaintenance);

router.get("/all", maintenanceController.getAllMaintenance);

module.exports = router;