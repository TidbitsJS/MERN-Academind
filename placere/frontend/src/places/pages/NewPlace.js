import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import ErrorModal from "../../shared/components/UIElements/Modal";
import Spinner from "../../shared/components/UIElements/Spinner";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/utils/Validators";
import { useForm } from "../../shared/hooks/FormHook";
import { useHttpClient } from "../../shared/hooks/HttpHook";
import { AuthContext } from "../../shared/context/Auth-Context";
import "./place.css";

const NewPlace = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
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

  const history = useHistory();

  const placeSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        `${process.env.REACT_APP_SERVER_URI}/api/places`,
        "POST",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
          address: formState.inputs.address.value,
          creator: auth.userId,
        }),
        {
          "Content-Type": "application/json",
        }
      );

      history.push("/");
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form" onSubmit={placeSubmitHandler}>
        {isLoading && <Spinner asOverlay />}
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
          errorText={
            "Please enter a valid description (at least 5 characters) "
          }
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
    </React.Fragment>
  );
};

export default NewPlace;
