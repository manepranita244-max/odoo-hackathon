const express = require("express");
const dashboardController = require("../controllers/dashboardController");

const router = express.Router();

router.get("/vehicle-status", dashboardController.getVehicleStatusBreakdown);

router.get("/kpis", dashboardController.getKpis);

module.exports = router;