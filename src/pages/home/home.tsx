import {  useEffect, useState } from "react";
import styles from "./home.module.css";
import { supabase } from "../../lib/supabase";


type bmiHistoryTypes = {
  id: number,
  weight: number,
  height: number,
  bmi: number
}


export default function Home() {
  

  const [height, setHeight] = useState<number>(0)
  const [weight, setWeight] = useState<number>(0)
  const bmi = weight && height ? weight / ((height / 100) ** 2) : null
  const [bmiHistory, setBmiHistory] = useState<bmiHistoryTypes[]>([])


  // Fetch table from db
  async function getBmiHistory() {
    console.log("fetching..."); // debug

    const { data, error } = await supabase.from('bmi').select()
    if (error) {
      console.error(error)
      return
    }
    // Set the history
    setBmiHistory(data)

    console.error(error)
  }

  // Post new record 
  async function postBmiHistory() {
    console.log("posting...") // debug

    const {data, error } = await supabase
    .from('bmi')
    .insert({ weight: weight, height: height, bmi: bmi })
    .select(); // also select the inserted

    // If the record got inserted append it
    if(data != null){
      setBmiHistory([...bmiHistory, ...data]);
    }

    // Reset height and weight
    setHeight(0);
    setWeight(0);

    console.error(error)
  }


  useEffect(()=>{
    if (bmi !> 0) return;

    const callApi = async () => {
      try {
        const apiResult = await getBmiHistory()
        console.log(apiResult);
      } catch (error) {
        console.error(error)
      }
      
    };

    callApi();
  },[bmi])


  

  


  return (
    <div className={styles.page}>
      <h1 className={styles.title}>BMI calculator</h1>
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
        <button className={styles.button} type="button" onClick={()=> postBmiHistory()}>Calculate</button>
      </form>
      <p className={styles.result}>
        Your BMI is: <strong>{bmi ? bmi.toFixed(2) : "-"}</strong>
      </p>

      <table className={styles.table}> 
        <thead>
          <tr >
            <th>Height</th>
            <th>Weight</th>
            <th>BMI</th>
          </tr>
        </thead>
        <tbody>
          {bmiHistory.map(bmirecord =>
            <tr key={bmirecord.id}>
              <td>{bmirecord.height}cm</td>
              <td>{bmirecord.weight}kg</td>
              <td>{bmirecord.bmi.toFixed(2)}</td>
            </tr>
          )}
        </tbody>
      </table>
      
      

     
    </div>
  );
}
