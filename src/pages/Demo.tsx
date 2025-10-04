import { useState, useRef } from "react";
import styles from "./Demo.module.css";
import { useParams } from "@tanstack/react-router";
import { FaArrowRight} from "react-icons/fa";
import AppConfig from "../../config.ts";

type Para = {
    kind: string;
    device: string;
    device_rank: number;
    dimension: number;
    Nx: number;
    Ny: number;
    Nz: number;
    nu: number;
    eta: number;
    kappa: number;
    time_scheme: string;
    t_initial: number;
    t_final: number;
    dt: number;
};

const initialPara: Para = {
    kind: "",
    device: "CPU",
    device_rank: 0,
    dimension: 2,
    Nx: 128,
    Ny: 1,
    Nz: 128,
    nu: 0.1,
    kappa: 0.1,
    eta: 0.1,
    time_scheme: "EULER",
    t_initial: 0,
    t_final: 0.1,
    dt: 0.002,
};

const dimensionOptions = ["2","3"];
const gridOptions = ["128"];
const timeSchemeOptions = ["EULER", "RK2", "RK4"];

export default function Demo() {
    const { kind } = useParams({ from: "/demo/$kind" });
    const [para, setPara] = useState<Para>({
        ...initialPara,
        kind: kind.toUpperCase(),
    });
    const [output, setOutput] = useState("");
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [running, setRunning] = useState(false);
    const resultRef = useRef<HTMLDivElement>(null);

    const token = localStorage.getItem("accessToken");

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) {
        const { name, value } = e.target;

        setPara((prev) => ({
            ...prev,
            [name]:
                e.target.type === "number" || !isNaN(Number(value))
                    ? Number(value)
                    : value,
        }));
    }

    function onSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (socket && socket.readyState !== WebSocket.CLOSED) {
            socket.close();
        }

        const ws = new WebSocket(AppConfig.getRunUrl());

        ws.onopen = () => {
            console.log("WebSocket connected");
            ws.send(`Token:${token}`);
            ws.send(JSON.stringify(para));
        };

        ws.onmessage = (event) => {
            setOutput((prev) => prev + event.data + "\n");
        };

        ws.onerror = (err) => {
            console.error("WebSocket error:", err);
            setOutput("WebSocket error occurred.");
        };

        ws.onclose = () => {
            console.log("WebSocket closed");
        };

        setSocket(ws);
        setRunning(true);
        console.log("Launching the run");
    }

    function handleRunStop() {
        socket?.send("stop");
        setSocket(null);
    }

    function handleStartNewRun() {
        setOutput("");
        setRunning(false);
    }

    return (
        <div className={styles.container}>
            {!running && (
                <div className={styles.formContainer}>
                    <form onSubmit={onSubmit}>
                        <div>
                            <InputField
                                name="device"
                                label="Device"
                                type="select"
                                options={["CPU", "GPU"]}
                                value={para.device}
                                onChange={handleChange}
                            />
                            <InputField
                                name="device_rank"
                                label="Device Rank"
                                type="number"
                                value={para.device_rank}
                                onChange={handleChange}
                            />
                            <InputField
                                name="dimension"
                                label="Dimension"
                                type="select"
                                options={dimensionOptions}
                                value={para.dimension}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <InputField
                                name="Nx"
                                label="Nx"
                                type="select"
                                options={gridOptions}
                                value={para.Nx}
                                onChange={handleChange}
                            />
                            <InputField
                                name="Ny"
                                label="Ny"
                                type="select"
                                options={["1", ...gridOptions]}
                                value={para.Ny}
                                onChange={handleChange}
                            />
                            <InputField
                                name="Nz"
                                label="Nz"
                                type="select"
                                options={gridOptions}
                                value={para.Nz}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <InputField
                                name="nu"
                                label="Nu"
                                type="number"
                                value={para.nu}
                                onChange={handleChange}
                            />
                            <InputField
                                name="eta"
                                label="Eta"
                                type="number"
                                value={para.eta}
                                onChange={handleChange}
                            />
                            {kind === "mhd" && (
                                <InputField
                                    name="kappa"
                                    label="Kappa"
                                    type="number"
                                    value={para.kappa}
                                    onChange={handleChange}
                                />
                            )}
                        </div>

                        <div>
                            <InputField
                                name="time_scheme"
                                label="Time Scheme"
                                type="select"
                                options={timeSchemeOptions}
                                value={para.time_scheme}
                                onChange={handleChange}
                            />
                            <InputField
                                name="t_initial"
                                label="Initial Time"
                                type="number"
                                value={para.t_initial}
                                onChange={handleChange}
                            />
                            <InputField
                                name="t_final"
                                label="Final Time"
                                type="number"
                                value={para.t_final}
                                onChange={handleChange}
                            />
                            <InputField
                                name="dt"
                                label="Dt"
                                type="number"
                                value={para.dt}
                                onChange={handleChange}
                            />
                        </div>

                        <input type="hidden" name="kind" value={para.kind} />

                        <div className={styles.runButtonContainer}>
                            <button className={styles.runButton}>Run <FaArrowRight/>  </button>
                        </div>
                    </form>
                </div>
            )}
            {running && (
                <div className={styles.resultContainer}>
                    <div>
                        <button className={styles.clearButton} onClick={handleRunStop}>
                            Stop run
                        </button>
                        <button className={styles.clearButton} onClick={handleStartNewRun}>
                            New run
                        </button>
                    </div>
                    <div ref={resultRef} className={styles.outputContainer}>
                        <pre>{output}</pre>
                    </div>
                </div>
            )}
        </div>
    );
}

type InputFieldProps = {
    name: keyof Para;
    label: string;
    type: string;
    options?: string[];
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
};

function InputField({
                        name,
                        label,
                        type,
                        options,
                        value,
                        onChange,
                    }: InputFieldProps) {
    return (
        <div className={styles.inputContainer}>
            {type !== "hidden" && <label htmlFor={name}>{label}:</label>}
            {type === "hidden" ? (
                <input type="hidden" name={name} value={value} />
            ) : type === "select" ? (
                <select name={name} value={value} onChange={onChange}>
                    {options!.map((e) => (
                        <option key={e} value={e}>
                            {e}
                        </option>
                    ))}
                </select>
            ) : (
                <input name={name} type={type} value={value} onChange={onChange} disabled={true}  />
            )}
        </div>
    );
}