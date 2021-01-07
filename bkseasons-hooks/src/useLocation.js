import { useState, useEffect } from "react";

export default () => {
  const [lat, setLat] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    window.navigator.geolocation.getCurrentPosition(
      position => {
        // We called setState to update our app when we know the latitude value.
        // We DID NOT directly assign this.state.lat... its bad practice.
        setLat(position.coords.latitude);
      },
      err => {
        setErrorMessage(err.message);
      }
    );
  }, []);

  return [lat, errorMessage];
};
