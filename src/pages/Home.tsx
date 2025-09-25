import styles from './Home.module.css'
import {Link} from "@tanstack/react-router";

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.banner}>
        <h1>TurbulenceHub</h1>
        <p>Where passion meets turbulence</p>
      </div>


    <div className={styles.buttonContainer}>
        <button> <Link to={'/models'}> Try Models </Link></button>
        <button> <Link to={'/data'} > Explore Datasets </Link></button>
    </div>

      
      {/*<div className={styles.content}>*/}
      {/*      <Models />*/}
      {/*      <Data />*/}
      {/*</div>*/}
      
    </div>
  )
}


function Models() {
    return <div className={styles.models}>
        <h2>Explore different Models</h2>
    </div>
}

function Data() {
    return <div className={styles.data}>
        <h2>Download rich datasets</h2>
    </div>
}
