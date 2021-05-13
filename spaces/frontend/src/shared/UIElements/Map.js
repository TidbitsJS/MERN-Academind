import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import "./map.css";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const Map = (props) => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  const { center, zoom, text, creator } = props;

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: center,
      zoom: zoom,
    });

    let popup = new mapboxgl.Popup({
      offset: 25,
      closeButton: false,
    }).setText(creator);

    new mapboxgl.Marker().setLngLat(center).setPopup(popup).addTo(map.current);

    map.current.addControl(new mapboxgl.NavigationControl());
    map.current.addControl(new mapboxgl.FullscreenControl());
  });

  return (
    <div className="mapBox-container">
      <div className="map-sidebar">{text}</div>
      <div ref={mapContainer} className="map"></div>
    </div>
  );
};

export default Map;
