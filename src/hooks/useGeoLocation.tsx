import { useState } from "react";

export function useGeoLocation(defaultpostion = null) {
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState(defaultpostion);
  const [error, setError] = useState("");

  function getPosition() {
    if (!navigator.geolocation)
      return setError("Your browser doesnt support geoLoaction");

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setIsLoading(false);
      },
      (error) => {
        setError(error.message);
        setIsLoading(false);
      }
    );
  }

  return { isLoading, position, error, getPosition };
}
