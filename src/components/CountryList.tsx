import styles from "../components/CountryList.module.css";
import Spinner from "./Spinner";
import Message from "./Message";
import CountryItem from "./CountryItem";
import { useCitiesCustomHook } from "../contexts/CitiesContext";

export type Position = {
  lat: number;
  lng: number;
};

export type CityType = {
  cityName: string;
  country: string;
  emoji: string;
  date: string;
  notes: string;
  position: Position;
  id: number;
};

export type CityListType = {
  cities: CityType[];
  isLoading?: boolean;
};

export const getDefaultCity = (): CityType => ({
  cityName: "",
  country: "",
  emoji: "",
  date: "",
  notes: "",
  position: {
    lat: 0,
    lng: 0,
  },
  id: 0,
});

export default function CountryList() {
  const { cities, isLoading } = useCitiesCustomHook();

  if (isLoading) return <Spinner></Spinner>;

  if (!cities.length)
    return (
      <Message message="Add your first city by clicking a city on the map"></Message>
    );

  // Return Type

  type CountryReturnType = {
    country: string;
    emoji: string;
  };

  const countries = cities.reduce(
    (arr: CountryReturnType[], city): CountryReturnType[] => {
      // Logic Control
      if (!arr.map((el) => el.country).includes(city.country)) {
        return [...arr, { country: city.country, emoji: city.emoji }];
      } else {
        return arr;
      }
    },
    []
  );

  console.log(countries);
  return (
    <ul className={styles.countryList}>
      {countries.map((country, _) => {
        return <CountryItem key={_} country={country}></CountryItem>;
      })}
    </ul>
  );
}
