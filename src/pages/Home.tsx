import styles from './Home.module.css'
import {Link} from "@tanstack/react-router";
import { FaArrowRight } from "react-icons/fa";

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.banner}>
          <h1>Your one stop destination for all things turbulence</h1>
      </div>


    <div className={styles.buttonContainer}>
         <Link to={'/models'} className={styles.modelsButton}> <button> Try Models <FaArrowRight/> </button> </Link>
        <Link to={'/data'} className={styles.datasetButton}> <button>  Explore Datasets <FaArrowRight/> </button></Link>
    </div>

      
    </div>
  )
}

