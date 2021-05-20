import React from "react";

import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/utils/Validators";
import "./place.css";
import { useForm } from "../../shared/hooks/FormHook";

const NewPlace = () => {
  const [formState, inputHandler] = useForm({
    title: {
      value: "",
      isValid: false,
    },
    description: {
      value: "",
      isValid: false,
    },
    address: {
      value: "",
      isValid: false,
    },
  });

  const placeSubmitHandler = (event) => {
    event.preventDefault();
    console.log(formState.inputs);
  };

  return (
    <form className="place-form" onSubmit={placeSubmitHandler}>
      <Input
        id="title"
        placeholder="Enter Title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText={"Please enter a valid title"}
        onInput={inputHandler}
      />
      <Input
        id="description"
        placeholder="Enter description of place"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText={"Please enter a valid description (at least 5 characters) "}
        onInput={inputHandler}
      />
      <Input
        id="address"
        element="input"
        placeholder="Enter address of the place"
        label="Address"
        validators={[VALIDATOR_REQUIRE()]}
        errorText={"Please enter a valid address. "}
        onInput={inputHandler}
      />
      <Button type="submit" disabled={!formState.isValid}>
        Add Place
      </Button>
    </form>
  );
};

export default NewPlace;
