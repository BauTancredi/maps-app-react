import { useRef, useEffect, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import { v4 } from "uuid";
import { Subject } from "rxjs";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYmF1dGFuY3JlZGkiLCJhIjoiY2t2Nm43NWdmMWg0ODJucDYycHI0MjZrZCJ9.dOc_Ne1b2dPX0lr6WIRaEg";

export const useMapbox = (initialValue) => {
  const mapDiv = useRef();
  const setRef = useCallback((node) => {
    mapDiv.current = node;
  }, [])();

  const markers = useRef({});

  const moveMarker = useRef(new Subject());
  const newMarker = useRef(new Subject());

  const map = useRef();
  const [coords, setCoords] = useState(initialValue);

  const addMarker = useCallback((e, id) => {
    const { lng, lat } = e.lngLat || e;

    const marker = new mapboxgl.Marker();
    marker.id = id ?? v4();

    marker.setLngLat([lng, lat]).addTo(map.current).setDraggable(true);

    markers.current[marker.id] = marker;

    if (!id) {
      newMarker.current.next({
        id: marker.id,
        lng,
        lat,
      });
    }

    marker.on("drag", ({ target }) => {
      const { id } = target;
      const { lng, lat } = target.getLngLat();
      moveMarker.current.next({
        id,
        lng,
        lat,
      });
    });
  }, []);

  const updatePosition = useCallback(({ id, lng, lat }) => {
    markers.current[id].setLngLat({ lng, lat });
  }, []);

  useEffect(() => {
    const mapBox = new mapboxgl.Map({
      container: mapDiv.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [initialValue.lng, initialValue.lat],
      zoom: initialValue.zoom,
    });
    map.current = mapBox;
  }, [initialValue]);

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

  // Add markers
  useEffect(() => {
    map.current?.on("click", addMarker);
  }, [addMarker]);

  return {
    addMarker,
    coords,
    mapDiv,
    markers,
    newMarker$: newMarker.current,
    moveMarker$: moveMarker.current,
    setRef,
    updatePosition,
  };
};
