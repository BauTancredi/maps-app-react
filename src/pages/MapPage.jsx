import React, { useContext, useEffect } from "react";

import { useMapbox } from "../hooks/useMapbox";
import { SocketContext } from "../context/SocketContext";

const initialValue = {
  lng: 5,
  lat: 34,
  zoom: 2,
};

const MapPage = () => {
  const { coords, mapDiv, newMarker$, moveMarker$, addMarker, updatePosition } =
    useMapbox(initialValue);
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    newMarker$.subscribe((marker) => {
      socket.emit("new-marker", marker);
    });
  }, [newMarker$, socket]);

  useEffect(() => {
    moveMarker$.subscribe((marker) => {
      socket.emit("marker-updated", marker);
    });
  }, [socket, moveMarker$]);

  useEffect(() => {
    socket.on("marker-updated", (marker) => {
      updatePosition(marker);
    });
  }, [socket, updatePosition]);

  useEffect(() => {
    socket.on("new-marker", (marker) => {
      addMarker(marker, marker.id);
    });
  }, [socket, addMarker]);

  useEffect(() => {
    socket.on("active-markers", (markers) => {
      for (const key of Object.keys(markers)) {
        addMarker(markers[key], key);
      }
    });
  }, [socket, addMarker]);

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
