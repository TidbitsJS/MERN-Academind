const axios = require("axios");
const HttpError = require("../models/http.error");

async function getCoordsForAddress(address) {
  let response = await axios.get(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?limit=2&access_token=${process.env.MAPBOX_TOKEN}`
  );

  let data = response.data;

  if (data.features.length === 0) {
    const error = new HttpError(
      "Could not find location for the specified address.",
      422
    );
    throw error;
  }

  let coordinates = data.features[0].geometry.coordinates;
  return {
    lat: coordinates[1],
    lng: coordinates[0],
  };
}

module.exports = getCoordsForAddress;
