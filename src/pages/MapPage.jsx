import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYmF1dGFuY3JlZGkiLCJhIjoiY2t2Nm43NWdmMWg0ODJucDYycHI0MjZrZCJ9.dOc_Ne1b2dPX0lr6WIRaEg";

const initialValue = {
  lng: 5,
  lat: 34,
  zoom: 2,
};

const MapPage = () => {
  const mapDiv = useRef();
  const map = useRef();
  const [coords, setCoords] = useState(initialValue);

  useEffect(() => {
    const mapBox = new mapboxgl.Map({
      container: mapDiv.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [initialValue.lng, initialValue.lat],
      zoom: initialValue.zoom,
    });

    map.current = mapBox;
  }, []);

  // Move map
  useEffect(() => {
    map.current?.on("move", () => {
      const { lng, lat } = map.current?.getCenter();
      setCoords({
        lng: lng.toFixed(4),
        lat: lat.toFixed(4),
        zoom: map.current?.getZoom().toFixed(2),
      });
    });
  }, []);

  return (
    <>
      <div className="info">
        lng: {coords.lng} | lat: {coords.lat} | zoom: {coords.zoom}
      </div>
      <div className="mapContainer" ref={mapDiv}></div>
    </>
  );
};

export default MapPage;
