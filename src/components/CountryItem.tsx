import styles from "./CountryItem.module.css";

type CountryType = {
  emoji: string;
  country: string;
};

type CountryPropsType = {
  country: CountryType;
};

function CountryItem({ country }: CountryPropsType) {
  return (
    <li className={styles.countryItem}>
      <span>{country.emoji}</span>
      <span>{country.country}</span>
    </li>
  );
}

export default CountryItem;
