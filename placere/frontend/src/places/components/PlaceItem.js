import React, { useState, useContext } from "react";

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import Map from "../../shared/components/UIElements/Map";
import { AuthContext } from "../../shared/context/Auth-Context";
import { useHttpClient } from "../../shared/hooks/HttpHook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import Spinner from "../../shared/components/UIElements/Spinner";
import "./placeItem.css";
import { Link } from "react-router-dom";

const PlaceItem = (props) => {
  const auth = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [showCardActions, setShowCardActions] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const openMapHandlre = () => setShowMap(true);

  const closeMapHandler = () => setShowMap(false);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `${process.env.REACT_APP_SERVER_URI}/api/places/${props.id}`,
        "DELETE"
      );
      props.onDelete(props.id);
    } catch (err) {}
  };

  const showMoreHandler = () => {
    setShowMore(!showMore);
  };

  const showActionsHandler = () => {
    setShowCardActions(!showCardActions);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>Close</Button>}
      >
        <div className="map-container">
          <Map
            center={props.coordinates}
            zoom={16}
            text={props.title}
            creator={props.description}
          />
        </div>
      </Modal>

      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <>
            <Button inverse onClick={cancelDeleteHandler}>
              Cancel
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              Delete
            </Button>
          </>
        }
      >
        <p>
          Do you want to proceed and delete this place? Please note that it
          can't be undone thereafter
        </p>
      </Modal>

      <div className="place-item">
        <Card className="place-item__content">
          {isLoading && <Spinner asOverlay />}
          <div className="place-item__image">
            <img
              src={`${process.env.REACT_APP_SERVER_URI}/${props.image}`}
              alt={props.title}
            />

            <div
              className="place-item__infoCircle"
              onClick={showActionsHandler}
            >
              {!showCardActions ? (
                <i className="fa fa-plus" aria-hidden="true" />
              ) : (
                <i className="fas fa-times" />
              )}
            </div>
            <div
              className={
                "place-item__viewCircle " +
                (showCardActions ? "slide-bottom-view" : "")
              }
              onClick={openMapHandlre}
            >
              <i className="fas fa-map-signs" />
            </div>
            {auth.userId === props.creatorID && (
              <>
                <div
                  className={
                    "place-item__editCircle " +
                    (showCardActions ? "slide-bottom-edit" : "")
                  }
                >
                  <Link to={`/places/${props.id}`}>
                    <i className="fas fa-pencil-alt" />
                  </Link>
                </div>
                <div
                  className={
                    "place-item__deleteCircle " +
                    (showCardActions ? "slide-bottom-delete" : "")
                  }
                  onClick={showDeleteWarningHandler}
                >
                  <i className="fas fa-trash" />
                </div>
              </>
            )}
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            {!showMore && (
              <div className="show-more-btn">
                <button onClick={showMoreHandler}>More</button>
              </div>
            )}
            {showMore && (
              <>
                <div className="place-item_info-show">
                  <div className="place-item__infoSign">Info</div>
                </div>
                <p>{props.description}</p>
              </>
            )}
          </div>
          {showMore && (
            <>
              <div className="show-more-btn less">
                <button onClick={showMoreHandler}>Less</button>
              </div>
            </>
          )}
        </Card>
      </div>
    </React.Fragment>
  );
};

export default PlaceItem;
