import {  useState } from "react";
import styles from "./home.module.css";






export default function Home() {
  

  const [height, setHeight] = useState<number>(0)
  const [weight, setWeight] = useState<number>(0)
  const bmi = weight && height ? weight / ((height / 100) ** 2) : null

  


  return (
    <div className={styles.page}>
      <h1>BMI calculator</h1>
      <form className={styles.form}>
        <label>
          Height (cm)
          <input
            type="number"
            value={height || ""}
            onChange={(e) => setHeight(Number(e.target.value))}
          />
        </label>
        <label>
          Weight (kg)
          <input
            type="number"
            value={weight || ""}
            onChange={(e) => setWeight(Number(e.target.value))}
          />
        </label>
      </form>
      <p className={styles.result}>
        Your BMI is: <strong>{bmi ? bmi.toFixed(2) : "-"}</strong>
      </p>
    </div>
  );
}
