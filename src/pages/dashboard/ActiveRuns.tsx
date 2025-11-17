import {useEffect, useRef, useState} from "react";
import AppConfig from "../../../config.ts";
import styles from "@/pages/dashboard/ActiveRuns.module.css";
import {ToastType, useToast} from "@/contexts/ToastContext.tsx";

interface RunInfo {
    kind:string,
    dimension:string,
    resolution:string,
    timeOfRun:string,
    processInfoId:string,
}

export default function ActiveRuns() {
    const [activeRuns, setActiveRuns] = useState<RunInfo[]>([]);
    const {addToast} = useToast();
    const [mode,setMode] = useState<string>("list");
    const runIdRef = useRef<string>("");

    async function getActiveRuns() {
        const response = await fetch(`${AppConfig.getBaseUrl()}/active-runs`,

            {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("accessToken")
                }
            }
        );

        if(response.ok) {
            const activeRunsData = await response.json();
            setActiveRuns(activeRunsData);

        }
    }

    async function stopRun(id:string) {
        const response = await fetch(`${AppConfig.getBaseUrl()}/stop-run`,
            {
                method: "POST",
                body: id,
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("accessToken")
                }
            }
            );

        if(response.ok) {
            addToast("Run stopped successfully",ToastType.success);
            await getActiveRuns();
        } else {
            addToast("Some error occurred while stopping the run",ToastType.error);
        }
    }

    function changeMode(mode:string,runId:string = "") {

        if(mode == "output" && runId != "") {
                setMode(mode);
                runIdRef.current = runId;
                // setUpWebSocket(runId);
        } else if(mode == "list") {
            setMode(mode);
            getActiveRuns();
        }
    }

    function handleRunStop(socket:WebSocket|null) {
        if(socket == null || socket.readyState === WebSocket.CLOSED) {
            return;
        }
        socket.send("stop");
        socket.close();
    }


    useEffect(() => {
        getActiveRuns();
    },[])


    return <div className={styles.container}>
        {mode == "list" && <ListActiveRunsWindow /> }
        {mode == "output" && <OutputWindow runId={runIdRef.current} changeMode={changeMode} handleRunStop={handleRunStop} />}
    </div>

    function ListActiveRunsWindow() {
        return <div className={styles.activeRunListWindow}>
            <h1>Currently Running Simulations</h1>
            { activeRuns.length === 0 &&
                <div className={styles.noRunContainer}>
                    <p>There are no active runs currently.</p>
                </div>
            }

            {
                activeRuns.length !== 0 &&
                <div className={styles.runContainer}>
                    {activeRuns.map((runInfo:RunInfo)=> <ActiveRunItem runInfo={runInfo} key={runInfo.processInfoId} /> )}
                </div>
            }
        </div>
    }






    function ActiveRunItem({runInfo}: {runInfo: RunInfo}) {
        return <div className={styles.activeRunItem}>
            <div className={styles.runInformation}>
                <div>
                    <p>{runInfo.kind}</p>
                    <p>{runInfo.dimension}D</p>
                    <p>{runInfo.resolution}</p>
                </div>

                <div>
                    <p>{runInfo.timeOfRun.split('_').slice(0,3).join('-')}</p>
                    <p>{runInfo.timeOfRun.split('_').slice(3,6).join(':')}</p>
                </div>
            </div>

            <div className={styles.actionButtons}>
                <button onClick={() => {changeMode("output",runInfo.processInfoId)}}>See Output</button>
                <button onClick={async ()=> { await stopRun(runInfo.processInfoId)}}>Stop Run</button>
            </div>


        </div>
    }
}


function OutputWindow({runId,changeMode,handleRunStop} : {runId:string,changeMode: (mode: string, runId?: string) => void, handleRunStop: (socket: WebSocket) => void}) {
    const socketRef = useRef<WebSocket|null>(null);
    const [output, setOutput] = useState("");
    const resultRef = useRef<HTMLDivElement>(null);

    function setUpWebSocket() {

        const ws = new WebSocket(AppConfig.getRunOutputUrl());

        ws.onopen = () => {
            console.log("WebSocket connected");
            ws.send(`RunId:${runId}`);
        };

        ws.onmessage = (event) => {
            setOutput((prev) => prev + event.data + "\n");
            if(resultRef.current) {
                resultRef.current.scrollTop = resultRef.current.scrollHeight;
            }
        };

        ws.onerror = (err) => {
            console.error("WebSocket error:", err);
            setOutput("WebSocket error occurred.");
        };

        ws.onclose = () => {
            console.log("WebSocket closed");
            if(resultRef.current) {
                resultRef.current.scrollTop = resultRef.current.scrollHeight;
            }
        };

        socketRef.current = ws;
        console.log("Launching the run");
    }

    useEffect(() => {
        setUpWebSocket();
    },[])


    return <div className={styles.outputWindow}>
        <div>
            <button className={styles.clearButton} onClick={() => { changeMode("list")}}>
                Go Back
            </button>
            <button className={styles.clearButton} onClick={() => {
                if(socketRef.current === null) {
                    return;
                }
                handleRunStop(socketRef.current);
            }}>
                Stop run
            </button>
        </div>
        <div ref={resultRef} className={styles.outputContainer}>
            <pre>{output}</pre>
        </div>
    </div>
}








