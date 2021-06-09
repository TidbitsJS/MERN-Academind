const fs = require("fs");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http.error");
const getCoordsForAddress = require("../utils/location");

const Place = require("../models/place");
const User = require("../models/user");

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.placeId;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a place.",
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError(
      "Could not find a place for the provided id.",
      404
    );
    return next(error);
  }

  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesbyUserId = async (req, res, next) => {
  const userId = req.params.userId;
  let places;
  try {
    // places = await Place.find({ creator: userId });
    places = await User.findById(userId).populate("places");
  } catch (err) {
    const error = new HttpError(
      "Fetching places failed, please try again.",
      500
    );

    return next(error);
  }

  if (!places || places.length === 0) {
    const error = new HttpError(
      "Could not find places for the provided user id.",
      404
    );
    return next(error);
  }

  res.json({
    // places: places.map((place) => place.toObject({ getters: true })),
    places: places.places.map((place) => place.toObject({ getters: true })),
  });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, description, address, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: req.file.path,
    creator,
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError(
      "Unable to create place, please try again",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provided id", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();

    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);

    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("Creating place failed, please try again", 500);
    console.log(err);
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const updatePlaceId = req.params.placeId;
  const { title, description, address } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  let updatedPlace;
  try {
    updatedPlace = await Place.findById(updatePlaceId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update place.",
      500
    );
    return next(error);
  }

  updatedPlace.title = title;
  updatedPlace.description = description;
  updatedPlace.address = address;
  updatedPlace.location = coordinates;

  try {
    await updatedPlace.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update place.",
      500
    );
    return next(error);
  }

  res.status(200).json({ place: updatedPlace.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const deletePlaceId = req.params.placeId;

  let toDeletePlace;
  try {
    toDeletePlace = await Place.findById(deletePlaceId).populate("creator");
  } catch (err) {
    const error = new HttpError("Could not find a place for that id.", 404);
    return next(error);
  }

  if (!toDeletePlace) {
    const error = new HttpError("Could not find place for this id.", 500);
    return next(error);
  }

  const imagePath = toDeletePlace.image;

  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    toDeletePlace.remove({ session: session });
    toDeletePlace.creator.places.pull(toDeletePlace);

    await toDeletePlace.creator.save({ session: session });
    await session.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete the place.",
      500
    );
    return next(error);
  }

  fs.unlink(imagePath, (err) => {
    console.log(err);
  });

  res.status(200).json({ message: "Deleted place." });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesbyUserId = getPlacesbyUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
