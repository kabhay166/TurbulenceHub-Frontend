import styles from "./CompletedRuns.module.css";
import {FaTimes} from "react-icons/fa";
import {useState} from "react";
import type {CompletedRunData} from "@/pages/dashboard/interfaces.ts";
import AnalyzeRun from "@/pages/dashboard/AnalyzeRun.tsx";

export default function CompletedRuns({ completedRunData } : { completedRunData : CompletedRunData[]}) {

    const [showParameters, setShowParameters] = useState<boolean>(false);
    const [currentRun,setCurrentRun] = useState<CompletedRunData|null>(null);
    const [showAnalyzePage,setShowAnalyzePage] = useState<boolean>(false);

    function handleShowParameterClicked(id:string) {
        const selectedRun : CompletedRunData|undefined =  completedRunData.find((e) => e.id === id);
        setCurrentRun(selectedRun !== undefined ? selectedRun : null);
        setShowParameters(true);
    }

    function handleAnalyzeButtonClicked(id:string) {
        const selectedRun : CompletedRunData|undefined =  completedRunData.find((e) => e.id === id);
        setCurrentRun(selectedRun !== undefined ? selectedRun : null);
        setShowParameters(true);
        setShowAnalyzePage(true);
        console.log('handle analyze for: ', id);

    }

    function closeAnalyzeWindow() {
        setShowAnalyzePage(false);
        setShowParameters(false);
    }

    function closeParameterWindow() {
        setShowParameters(false);
    }

    return <div className={styles.completedRunsContainer}>
        {
            !showAnalyzePage &&  <>

                <h1>Completed Runs</h1>
                <div className={styles.completedRunsListContainer}>
                    {completedRunData.map((e) => <CompletedRunItem completedRunData={e}
                                                                   onAnalyzeRunClicked={handleAnalyzeButtonClicked}
                                                                   onShowParametersClicked={handleShowParameterClicked}/> )}
                </div>

                { (showParameters && currentRun !== null) &&
                    <ParameterWindow completedRunData={currentRun} closeParameterWindow={closeParameterWindow} />
                }

        </>
        }

        {
            (showAnalyzePage && currentRun !== null) && <AnalyzeRun completedRunData={currentRun} closeAnalyzeWindow={closeAnalyzeWindow}/>
        }


        </div>;
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

function ParameterWindow({completedRunData,closeParameterWindow} : {completedRunData: CompletedRunData,closeParameterWindow: () => void}) {
    return <div className={styles.parameterWidow}>
        <div><p>Run Parameters</p> <FaTimes color={'white'} onClick={closeParameterWindow} /></div>
        <div>
            <p>Kind: {completedRunData.kind}</p>
            <p>Dimension: {completedRunData.dimension}</p>
            <p>Resolution: {completedRunData.resolution}</p>
            <p>Date of Run: {new Date(Date.parse(completedRunData.timeOfRun)).toDateString()}</p>
            <p>Time of Run: {new Date(Date.parse(completedRunData.timeOfRun)).toLocaleTimeString()}</p>

        </div>

    </div>
}