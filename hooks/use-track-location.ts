"use client";

import { useState } from "react";

type PositionType = {
  coords: { latitude: number; longitude: number };
};
const useTrackLocation = () => {
  // Creo variables de estado
  const [isFindingLocation, setIsFindingLocation] = useState(false);
  const [longLat, setLongLat] = useState("");
  const [locationErrorMsg, setLocationErrorMsg] = useState("");

  function success(position: PositionType) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    setLongLat(`${longitude}%2C${latitude}`);
    setIsFindingLocation(false);
    setLocationErrorMsg("");
  }

  function error() {
    setIsFindingLocation(false);
    setLocationErrorMsg("Unable to retrieve your location");
    alert("Sorry, no position available.");
  }
  const handleTrackLocation = () => {
    if (!navigator.geolocation) {
      setLocationErrorMsg("Location not supported in your browser");
    } else {
      setIsFindingLocation(true);
      navigator.geolocation.getCurrentPosition(success, error);
      setLocationErrorMsg("");
    }
  };
  return { isFindingLocation, handleTrackLocation, longLat, locationErrorMsg };
};

export default useTrackLocation;
