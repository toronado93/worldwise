import styles from "../components/CityList.module.css";
import Spinner from "./Spinner";
import CityItem from "./CityItem";
import Message from "./Message";
import { useCitiesCustomHook } from "../contexts/CitiesContext";

export default function CityList() {
  const { cities, isLoading } = useCitiesCustomHook();

  if (isLoading) return <Spinner></Spinner>;

  if (!cities.length)
    return (
      <Message message="Add your first city by clicking a city on the map"></Message>
    );

  return (
    <ul className={styles.cityList}>
      {cities.map((city) => {
        return <CityItem key={city.id} city={city}></CityItem>;
      })}
    </ul>
  );
}
