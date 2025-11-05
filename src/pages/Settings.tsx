import styles from "./Settings.module.css";
// import {useState} from "react";

interface Settings {
    notifyOnCompletion: boolean;

}

export default function Settings() {

    // const [settings,setSettings] = useState<Settings|null>(null);


    function handleSettingChanged(e: React.ChangeEvent<HTMLInputElement>) {
        console.log(e);
        // const { name, value } = e.target;
        //
        // let newSettings : Settings|null = settings;
        //
        // if(newSettings === null) {
        //     newSettings = {
        //         [name]:value,
        //     };
        // } else {
        //      newSettings = {
        //         ...settings,
        //         [name]:value,
        //     };
        // }
        //
        // setSettings(newSettings);

    }


    return <div className={styles.container}>
        <h1>Settings</h1>
        
        <div className={styles.settingsContainer}>
            <div className={styles.settingItem}>
                <form action="">
                    <SettingItem name={'notifyOnCompletion'} label={'Notify when a run has completed'} onChanged={handleSettingChanged} />
                </form>
            </div>
        </div>
    </div>
}

function SettingItem({name,label,onChanged} : {name:string,label:string,onChanged:(e:React.ChangeEvent<HTMLInputElement>) => void}) {
    return <>
        <label htmlFor={name}>{label}:</label> <input id={name} name={name} type="checkbox" onChange={onChanged} />
    </>

}