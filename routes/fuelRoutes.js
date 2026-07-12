const express = require("express");

const router = express.Router();

const fuelController = require("../controllers/fuelController");

router.post("/add", fuelController.addFuel);

router.get("/all", fuelController.getAllFuel);

module.exports = router;