const express = require("express");

const placesControllers = require("../controllers/places.controller");

const router = express.Router();

router.get("/", (req, res, next) => {
  console.log("GET Request in Places");
  res.json({
    message: "It works!",
  });
});

router.get("/:placeId", placesControllers.getPlaceById);

router.get("/user/:userId", placesControllers.getPlacebyUserId);

module.exports = router;