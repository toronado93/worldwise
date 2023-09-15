// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";

import styles from "./Form.module.css";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { useUrlPosition } from "../hooks/useUrlPosition";
import Message from "./Message";
import Spinner from "./Spinner";
import { CityType } from "./CountryList";
import { useCitiesCustomHook } from "../contexts/CitiesContext";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const navigate = useNavigate();
  // Location by paragm
  const [lat, lng] = useUrlPosition();
  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);

  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [emoji, setEmoji] = useState("");
  // Error Handling-01
  const [geocodingError, setGeoCodingError] = useState("");

  // CitiesContext Custom Hook
  const { createCity, isLoading } = useCitiesCustomHook();

  useEffect(() => {
    // We can narrow our effects again unwanted fetch , for example user react the for without lat long
    // we call this narrow handling
    if (!lat && !lng) return;

    async function fetchCityData() {
      try {
        setIsLoadingGeocoding(true);

        // Error Handling-02
        setGeoCodingError("");
        const res = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
        );
        const data = await res.json();
        setCityName(data.city || data.locality || "");
        setCountry(data.countryName || "");
        setEmoji(convertToEmoji(data.countryCode));

        // Nice Example Throwing Error in try and catch blog

        if (!data.countryName)
          // Error Handling-03
          throw Error("This is not a country , Click somewhere else.");
      } catch (error) {
        //Error Handling-04
        setGeoCodingError(error.message);
        console.log(error);
      } finally {
        setIsLoadingGeocoding(false);
      }
    }
    fetchCityData();
  }, [lat, lng]);

  // Handling Form For Adding New City

  async function handleSubmit(e) {
    e.preventDefault();

    // Control
    if (!cityName || !date) return;

    const newCity: CityType = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: { lat, lng },
    };

    try {
      const res = await createCity(newCity);
      navigate("/app/cities");
    } catch (error) {
      console.log(error);
    }
  }

  // Creating new city in json-server

  // Loading Spinner and Error Hnadling and rendering via throwed error is crucial.

  // Example Loading Usage
  if (isLoadingGeocoding) return <Spinner></Spinner>;

  // Error Handling-05 Component Rendering
  if (geocodingError) return <Message message={geocodingError}></Message>;

  // If there is no lat and lng we show the user message instead of form component

  if (!lat && !lng)
    return <Message message="Start to click somewhere on the map"></Message>;

  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""} `}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        /> */}
        <DatePicker
          dateFormat="dd-MM-yyyy"
          selected={date}
          onChange={(date) => {
            setDate(date);
          }}
        ></DatePicker>
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <Button
          type="back"
          onclick={(e) => {
            e.preventDefault();
            navigate("/app/cities");
          }}
        >
          &larr; Back
        </Button>
      </div>
    </form>
  );
}

export default Form;
