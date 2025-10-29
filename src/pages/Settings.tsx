import styles from "./Settings.module.css";

export default function Settings() {
    return <div className={styles.container}>
        <h1>Settings</h1>
        
        <div className={styles.settingsContainer}>
            <div className={styles.settingItem}>
                <form action="">

                </form>
            </div>
        </div>
    </div>
}

function SettingItem({name,label,onChanged} : {name:string,label:string,onChanged:(e:React.ChangeEvent<Html>) => void}) {
    <>
        <label htmlFor="notifyOnCompletion">Notify when a run has completed:</label> <input id={'notifyOnCompletion'} name={'notifyOnCompletion'} type="checkbox"/>
    </>

}