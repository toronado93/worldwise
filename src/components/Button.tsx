import { ReactNode } from "react";
import styles from "./Button.module.css";

type ButtonType = {
  children: ReactNode;
  onclick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  type: string;
};

export default function Button({ children, onclick, type }: ButtonType) {
  return (
    <button className={`${styles.btn} ${styles[type]}`} onClick={onclick}>
      {children}
    </button>
  );
}
