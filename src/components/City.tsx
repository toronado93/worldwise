import { useNavigate, useParams } from "react-router-dom";
import styles from "./City.module.css";
import { useCitiesCustomHook } from "../contexts/CitiesContext";
import Button from "./Button";
import { useEffect } from "react";
import Spinner from "./Spinner";

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

function City() {
  // Catch the param
  const { id } = useParams();
  // const cityId: number = parseInt(id || "0", 10);
  // Navigate
  const navigate = useNavigate();

  // Context
  const { getCity, currentCity, isLoading } = useCitiesCustomHook();

  useEffect(() => {
    getCity(id);
  }, [id]);

  // Customizated cities , we will get this aditionaly apart from actual context cities data , for making practice , purpose of the practice is imagine cities is so big object and cause a performance issue , and wedont wanna call here entire object from context , we wanna create custom hook and take what we need in small portion.

  // Create new array using filter and get the target City
  // const currentCity = cities.filter((city: CityType) => city.id === cityId);
  const { cityName, emoji, date, notes } = currentCity;

  return (
    <>
      {isLoading ? (
        <Spinner></Spinner>
      ) : (
        <div className={styles.city}>
          <div className={styles.row}>
            <h6>City name</h6>
            <h3>
              <span>{emoji}</span> {cityName}
            </h3>
          </div>

          <div className={styles.row}>
            <h6>You went to {cityName} on</h6>
            <p>{date ? formatDate(date) : ""}</p>
          </div>

          {notes && (
            <div className={styles.row}>
              <h6>Your notes</h6>
              <p>{notes}</p>
            </div>
          )}

          <div className={styles.row}>
            <h6>Learn more</h6>
            <a
              href={`https://en.wikipedia.org/wiki/${cityName}`}
              target="_blank"
              rel="noreferrer"
            >
              Check out {cityName} on Wikipedia &rarr;
            </a>
          </div>

          <div>
            <Button
              type="back"
              onclick={() => {
                navigate(-1);
              }}
            >
              &larr; Back
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export default City;
