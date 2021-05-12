import React from "react";

import PlaceList from "../components/PlaceList";
const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famours sky scrapers in the world!",
    imageUrl: "https://source.unsplash.com/1600x900/?building",
    address: "20 W 34th St, New York, NY 10001",
    location: {
      lat: 40.7484405,
      lang: -73.9878584,
    },
    creator: "u1",
  },
  {
    id: "p2",
    title: "Empire State Building",
    description: "One of the most famours sky scrapers in the world!",
    imageUrl: "https://source.unsplash.com/1600x900/?tech",
    address: "20 W 34th St, New York, NY 10001",
    location: {
      lat: 40.7484405,
      lang: -73.9878584,
    },
    creator: "u2",
  },
  {
    id: "p3",
    title: "Empire State Building",
    description: "One of the most famours sky scrapers in the world!",
    imageUrl: "https://source.unsplash.com/1600x900/?nature",
    address: "20 W 34th St, New York, NY 10001",
    location: {
      lat: 40.7484405,
      lang: -73.9878584,
    },
    creator: "u3",
  },
];

const UserPlaces = () => {
  return <PlaceList items={DUMMY_PLACES} />;
};

export default UserPlaces;
