import styles from "./CompletedRuns.module.css";
import {FaTimes} from "react-icons/fa";
import {useState} from "react";


export default function CompletedRuns({ completedRunData } : { completedRunData : CompletedRunData[]}) {

    const [showParameters, setShowParameters] = useState<boolean>(false);
    const [currentRun,setCurrentRun] = useState<CompletedRunData|null>(null);

    function handleShowParameterClicked(id:string) {
        const selectedRun : CompletedRunData|undefined =  completedRunData.find((e) => e.id === id);
        setCurrentRun(selectedRun !== undefined ? selectedRun : null);
        setShowParameters(true);
    }

    function handleAnalyzeButtonClicked(id:string) {

    }

    return (
        <div className={styles.completedRunsContainer}>
            <h1>Completed Runs</h1>
            <div className={styles.completedRunsListContainer}>
                {completedRunData.map((e) => <CompletedRunItem completedRunData={e}
                                                               onAnalyzeRunClicked={handleAnalyzeButtonClicked}
                                                               onShowParametersClicked={handleShowParameterClicked}/> )}
            </div>

            { (showParameters && currentRun !== null) &&
                <ParameterWindow completedRunData={currentRun} />
            }
        </div>

);
}



interface CompletedRunData {
    id:string,
    kind:string,
    dimension:string,
    resolution:string,
    timeOfRun:string,
}

function CompletedRunItem({completedRunData, onAnalyzeRunClicked, onShowParametersClicked} : {completedRunData: CompletedRunData, onAnalyzeRunClicked: (id:string) => void, onShowParametersClicked : (id:string) => void}) {
    return (
        <div className={styles.completedRunItem}>
            <div className={styles.completedRunItemInfoContainer}>
                <div>
                    <p>{completedRunData.kind}</p>
                    <p>{completedRunData.dimension}D</p>
                    <p>{completedRunData.resolution}</p>
                </div>
                <div>
                    <p>{new Date(Date.parse(completedRunData.timeOfRun)).toDateString()}</p>
                    <p>{new Date(Date.parse(completedRunData.timeOfRun)).toLocaleTimeString()}</p>
                </div>
            </div>

            <div>
                <p></p>
            </div>

            <button onClick={() => {onAnalyzeRunClicked(completedRunData.id)}}>Analyze Run</button>
            <button onClick={() => {onShowParametersClicked(completedRunData.id)}}>Show Parameters</button>
        </div>
    );
}

function ParameterWindow({completedRunData} : {completedRunData: CompletedRunData}) {
    return <div className={styles.parameterWidow}>
        <div><p>Run Parameters</p> <button><FaTimes color={'white'} /></button></div>
        <div>
            <p>{completedRunData.kind}</p>
            <p>{completedRunData.dimension}</p>
            <p>{completedRunData.resolution}</p>
            <p>{new Date(Date.parse(completedRunData.timeOfRun)).toDateString()}</p>
            <p>{new Date(Date.parse(completedRunData.timeOfRun)).toLocaleTimeString()}</p>
        </div>

    </div>
}