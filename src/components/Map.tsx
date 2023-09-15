import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "../components/Map.module.css";
import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useCitiesCustomHook } from "../contexts/CitiesContext";
import { useGeoLocation } from "../hooks/useGeoLocation";
import Button from "./Button";

export default function Map() {
  const navigate = useNavigate();
  const { cities, currentCity } = useCitiesCustomHook();

  const [mapPosition, setMapPosition] = useState([40.9051, 29.2665]);
  const [searchParams] = useSearchParams();

  const mapLat = searchParams?.get("lat")
    ? searchParams?.get("lat")
    : mapPosition[0];
  const mapLng = searchParams?.get("lng")
    ? searchParams?.get("lng")
    : mapPosition[1];

  // we use useeffect in order to update and keep the location which comes from param

  useEffect(() => {
    if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
  }, [mapLat, mapLng]);

  // usage of geoloaction external hook

  const {
    isLoading: isLoadingFromGeo,
    position,
    error,
    getPosition,
  } = useGeoLocation();

  // Useeffect for when i click to button and bring my position here update the map position

  useEffect(() => {
    async function fetchLocation() {
      try {
        if (position) setMapPosition([position.lat, position.lng]);
      } catch (error) {
        console.log();
      }
    }

    fetchLocation();
  }, [position]);

  return (
    <div className={styles.mapContainer}>
      <Button
        type="position"
        onclick={() => {
          getPosition();
        }}
      >
        {isLoadingFromGeo ? "Loading..." : "Use Your Position"}
      </Button>
      <MapContainer
        className={styles.map}
        center={mapPosition}
        zoom={10}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />

        {/* Marker for your current position */}
        {position ? (
          <Marker position={[position.lat, position.lng]}></Marker>
        ) : (
          ""
        )}

        {cities.map((city) => {
          return (
            <Marker
              key={city.id}
              position={[city.position.lat, city.position.lng]}
            >
              <Popup>{city.cityName}</Popup>
            </Marker>
          );
        })}
        <ChangeCenter position={mapPosition}></ChangeCenter>
        <DetectClick></DetectClick>
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ position }: string | number | any) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();

  useMapEvents({
    click: (e) => {
      //  Adding clicked location in to the url
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
  });
}
