import styles from './Home.module.css'
import {Link} from "@tanstack/react-router";

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.banner}>
          <h1>Your one stop destination for all things turbulence</h1>
          <div className={styles.buttonContainer}>
              <Link to={'/models'}> <button className={styles.modelsButton}> Try Models</button> </Link>
              <Link to={'/data'}> <button className={styles.datasetButton}>  Explore Datasets</button></Link>
          </div>
      </div>
      
    </div>
  )
}

