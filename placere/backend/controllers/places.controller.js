const HttpError = require("../models/http.error");

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapper in the world!",
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    address: "20 W 34th St, New York, NY 10001",
    creator: "u1",
  },
];

const getPlaceById = (req, res, next) => {
  const placeId = req.params.placeId;
  const place = DUMMY_PLACES.find((p) => p.id === placeId);

  if (!place) {
    const error = new HttpError(
      "Could not find a place for the provided id.",
      404
    );
    return next(error);
  }

  res.json({ place });
};

const getPlacebyUserId = (req, res, next) => {
  const userId = req.params.userId;
  const place = DUMMY_PLACES.find((p) => p.creator === userId);

  if (!place) {
    const error = new HttpError(
      "Could not find a user for the provided id.",
      404
    );
    return next(error);
  }

  res.json({ place });
};

exports.getPlaceById = getPlaceById;
exports.getPlacebyUserId = getPlacebyUserId;
