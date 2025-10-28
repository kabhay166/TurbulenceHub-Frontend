import styles from "./CompletedRuns.module.css";


interface CompletedRunData {
    id:string,
    kind:string,
    dimension:string,
    resolution:string,
    timeOfRun:string,
}

export default function CompletedRuns({ completedRunData } : { completedRunData : CompletedRunData[]}) {
    return (
        <div className={styles.completedRunsContainer}>
            <h1>Completed Runs</h1>
            <div className={styles.completedRunsListContainer}>
                {completedRunData.map((e) => <CompletedRunItem completedRunData={e} /> )}
            </div>
        </div>
    );
}

function CompletedRunItem({completedRunData} : {completedRunData: CompletedRunData}) {
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

            <button>Analyze Run</button>
            <button>Show Parameters</button>
        </div>
    );
}