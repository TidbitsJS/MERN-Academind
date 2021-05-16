import React from "react";
import { useParams } from "react-router-dom";

import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/utils/Validators";

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
    address: "20 W 34th St, New York, NY 10001",
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: "u1",
  },
  {
    id: "p2",
    title: "Wild Life Venture",
    description: "Visting the wild life!",
    imageUrl: "https://source.unsplash.com/1600x900/?animal",
    address: "221 Baker Street, London",
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: "u2",
  },
  {
    id: "p3",
    title: "Fast and Furious infinity",
    description: "Most deadly route to go for. Don't get distracted!",
    imageUrl: "https://source.unsplash.com/1600x900/?car",
    address: "121 E 12th dead st, Dead Valley, Deathvilla",
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: "u2",
  },
];

const UpdatePlace = () => {
  const placeId = useParams().placeId;

  const identifiedPlace = DUMMY_PLACES.find((p) => p.id === placeId);

  if (!identifiedPlace) {
    return (
      <div className="center">
        <h2>Could not find place!</h2>
      </div>
    );
  }

  return (
    <form className="place-form" onSubmit={() => {}}>
      <Input
        id="title"
        element="input"
        placeholder="Enter Title"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
        onInput={() => {}}
        value={identifiedPlace.title}
        valid={true}
      />
      <Input
        id="description"
        element="textarea"
        placeholder="Enter description of place"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText={"Please enter a valid description (at least 5 characters) "}
        onInput={() => {}}
        value={identifiedPlace.description}
        valid={true}
      />
      <Input
        id="address"
        element="input"
        placeholder="Enter address of the place"
        type="text"
        label="Address"
        validators={[VALIDATOR_REQUIRE()]}
        errorText={"Please enter a valid address. "}
        onInput={() => {}}
        value={identifiedPlace.address}
        valid={true}
      />
      <Button type="submit" disabled={true}>
        Update Place
      </Button>
    </form>
  );
};

export default UpdatePlace;
