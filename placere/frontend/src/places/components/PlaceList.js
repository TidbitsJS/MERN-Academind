import React, { useContext } from "react";
import { useParams } from "react-router-dom";

import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import { AuthContext } from "../../shared/context/Auth-Context";
import PlaceItem from "./PlaceItem";
import "./placeList.css";

const PlaceList = (props) => {
  const auth = useContext(AuthContext);
  const userId = useParams().userId;

  if (props.items.length === 0 && auth.userId === userId) {
    return (
      <div className="place-list center">
        <Card>
          <h2>No places found. Maybe create one?</h2>
          <Button to="/places/new">Share place</Button>
        </Card>
      </div>
    );
  } else if (props.items.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          <h2>No places found</h2>
        </Card>
      </div>
    );
  }
  return (
    <div className="place-list">
      {props.items.map((place) => (
        <PlaceItem
          key={place.id}
          id={place.id}
          image={place.image}
          title={place.title}
          description={place.description}
          address={place.address}
          creatorID={place.creator}
          coordinates={place.location}
          onDelete={props.onDeletePlace}
        />
      ))}
    </div>
  );
};

export default PlaceList;
