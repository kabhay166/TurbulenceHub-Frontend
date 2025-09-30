import styles from "./PopUp.module.css";

export default function PopUp({message} : {message:string}) {
    return <div className={styles.popUpContainer}>
        <p>{message}</p>
    </div>
}