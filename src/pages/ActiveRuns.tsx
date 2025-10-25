import {useEffect, useRef, useState} from "react";
import AppConfig from "../../config.ts";
import styles from "@/pages/ActiveRuns.module.css";
import {useToast} from "@/contexts/ToastContext.tsx";

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
    const [mode,setMode] = useState<string>("list")
    const [output, setOutput] = useState("");
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const resultRef = useRef<HTMLDivElement>(null);


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
            addToast("Run stopped successfully");
            await getActiveRuns();
        } else {
            addToast("Some error occurred while stopping the run");
        }
    }

    function changeMode(mode:string,runId:string = "") {

        if(mode == "output" && runId != "") {
                setMode(mode);
                setUpWebSocket(runId);
        } else if(mode == "list") {
            setOutput("");
            if(socket && socket.readyState !== WebSocket.CLOSED) {
                socket.close();
            }
            setMode(mode);
        }
    }

    function handleRunStop() {
        socket?.send("stop");
        setSocket(null);
    }


    function setUpWebSocket(runId:string) {
        if (socket && socket.readyState !== WebSocket.CLOSED) {
            setOutput("");
            socket.close();
        }

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

        setSocket(ws);
        console.log("Launching the run");
    }


    useEffect(() => {
        getActiveRuns();
    },[])

    useEffect(() => {
        return () => {
            if (socket && socket.readyState !== WebSocket.CLOSED) {
                console.log("Closing WebSocket on unmount");
                socket.close();
            }
        };
    }, [socket]);


    return <div className={styles.container}>
        {mode == "list" && <ListActiveRunsWindow /> }
        {mode == "output" && <OutputWindow />}
    </div>

    function ListActiveRunsWindow() {
        return <>
            {activeRuns.map((runInfo:RunInfo)=> <ActiveRunItem runInfo={runInfo} /> )}
        </>
    }

    function OutputWindow() {
        return <div className={styles.outputWindow}>
                <div>
                    <button className={styles.clearButton} onClick={() => { handleRunStop()}}>
                        Stop run
                    </button>
                </div>
                <div ref={resultRef} className={styles.outputContainer}>
                    <pre>{output}</pre>
                </div>
        </div>
    }

    function ActiveRunItem({runInfo}: {runInfo: RunInfo}) {
        return <div className={styles.activeRunItem}>
            <div className={styles.runInformation}>
                <div>
                    <p>{runInfo.kind}</p>
                    <p>{runInfo.dimension}D</p>
                </div>

                <p>{runInfo.resolution}</p>
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








