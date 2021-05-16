import React from "react";

import Input from "../../shared/FormElements/Input";
import "./newPlace.css";

const NewPlace = () => {
  return (
    <form className="place-form">
      <Input
        element="input"
        type="text"
        label="Title"
        validators={[]}
        errorText={"Please enter a valid title"}
      />
    </form>
  );
};

export default NewPlace;
