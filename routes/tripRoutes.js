const express = require("express");

const router = express.Router();

const tripController = require("../controllers/tripController");

router.post("/add", tripController.createTrip);

router.get("/all", tripController.getAllTrips);

router.get("/:id", tripController.getTripById);

router.put("/:id", tripController.updateTrip);

router.delete("/:id", tripController.deleteTrip);

module.exports = router;