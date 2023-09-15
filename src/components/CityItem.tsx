// Third Party
import { Link, useNavigate } from "react-router-dom";

import { CityType } from "./CountryList";
import styles from "../components/CityItem.module.css";
import { useCitiesCustomHook } from "../contexts/CitiesContext";
type CityItemType = {
  city: CityType;
};

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

export default function CityItem({ city }: CityItemType) {
  const { emoji, cityName, date, id, position } = city;

  const navigate = useNavigate();

  const { currentCity, deleteCity } = useCitiesCustomHook();

  return (
    <Link
      className={`${styles.cityItem} ${
        currentCity.id === id ? styles["cityItem--active"] : ""
      } `}
      to={`${id}?lat=${position.lat}&lng=${position.lng}`}
    >
      <span className={styles.emoji}>{emoji}</span>
      <h3 className={styles.name}> {cityName}</h3>
      <time className={styles.data}>({formatDate(date)})</time>
      <button
        onClick={(e) => {
          e.preventDefault();
          deleteCity(id);
        }}
        className={styles.deleteBtn}
      >
        &times;
      </button>
    </Link>
  );
}
