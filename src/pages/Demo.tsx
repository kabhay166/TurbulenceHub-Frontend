import { useForm } from 'react-hook-form';
import styles from './Demo.module.css';
import { useRef, useState } from 'react';
import {useParams} from "@tanstack/react-router";
import {RunPath} from "@/global_configurations.ts";

type Para = {
    kind:string;
    device:string;
    device_rank: number;
    dimension: number;
    Nx: number
    Ny: number
    Nz: number
    nu: number
    eta: number
    kappa: number
    time_scheme: string
    t_initial: number
    t_final: number
    dt: number
}

type InputFieldProps = {
    name: keyof Para;
    label: string;
    type: string;
    pattern?: string;
    options?: string[];
};

const initialPara : Para = {
    kind: '',
    device: 'CPU',
    device_rank: 0,
    dimension: 2,
    Nx: 64,
    Ny: 1,
    Nz: 64,
    nu: 0.1,
    kappa: 0.1,
    eta: 0.1,
    time_scheme: 'EULER',
    t_initial: 0,
    t_final: 0.1,
    dt: 0.001

}

// const saveModes3Pattern : str = "\\(([0-9]+),([0-9]+),([0-9]+)\\)(,\\((([0-9]+),([0-9]+),([0-9]+))\\))*";

// const saveModes2Pattern : str = "\\(([0-9]+),([0-9]+)\\)(,\\((([0-9]+),([0-9]+))\\))*";

export default function Demo() {
    const {kind} = useParams({ from: "/demo/$kind" });
    initialPara.kind = kind.toUpperCase();
    const {register,handleSubmit} = useForm<Para>({defaultValues: initialPara});
    const [output, setOutput] = useState("");
    const resultRef = useRef<HTMLDivElement>(null);
    const [socket,setSocket] = useState<WebSocket | null>(null);
    const [running,setRunning] = useState<boolean>(false);

    function onSubmit(data:Para) {

        if(socket && socket.readyState !== WebSocket.CLOSED) {
            socket.close();
        }

        const ws = new WebSocket(RunPath);



        ws.onopen = () => {
            console.log("WebSocket connected");
            ws.send(JSON.stringify(data));
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
        socket!.send("stop");
        // socket!.close();
        setSocket(null);
    }

    function handleStartNewRun() {
        setOutput("")
        setRunning(false);

    }

    return (
        <div className={styles.container}>

            { !running &&  <div className={styles.formContainer}>
                <form action="" onSubmit={handleSubmit(onSubmit)}>

                    <div>
                        <InputField name="device" label='Device' type="select" options={["CPU","GPU"]} />
                        <InputField name='device_rank' label='Device Rank' type='number' />
                        <InputField name='dimension' label='Dimension' type='select' options={["2","3"]} />
                    </div>

                    <div>
                        <InputField name='Nx' label="Nx" type='select' options={["64","128","256"]} />
                        <InputField name='Ny' label='Ny' type='select' options={["1","64","128","256"]} />
                        <InputField name='Nz' label='Nz' type='select' options={["64","128","256"]} />
                    </div>

                    <div>
                        <InputField name='nu' label='Nu' type='number' />
                        <InputField name='eta' label='Eta' type='number' />
                        {kind === 'mhd' && <InputField name='kappa' label='Kappa' type='number' />}
                    </div>

                    <div>
                        <InputField name='time_scheme' label='Time Scheme' type='select' options={["EULER","RK2","RK4"]} />
                        <InputField name='t_initial' label='Initial Time' type='number' />
                        <InputField name='t_final' label='Final Time' type='number' />
                        <InputField name='dt' label='Dt' type='number' />
                    </div>

                    <InputField name='kind' label='Kind' type='hidden' />

                    <div className={styles.runButtonContainer}>
                        <button className={styles.runButton}>Run</button>
                    </div>

                </form>
            </div> }
            { running && <div className={styles.resultContainer}>
                <div>

                    <button className={styles.clearButton} onClick={handleRunStop}>Stop run</button>
                    <button className={styles.clearButton} onClick={handleStartNewRun}>New run</button>

                </div>
                <div ref={resultRef} className={styles.outputContainer}>

                    <pre>{output}</pre>
                </div>
            </div> }

        </div>

    )

    function InputField({name,label,type,pattern,options} : InputFieldProps) {
        console.log(pattern);
        return (
            <div className={styles.inputContainer}>
                { type !== 'hidden' &&
                    <label htmlFor={name}>{label}:</label>
                }
                { type === 'hidden' ? <input type='hidden' {...register(name)} /> : type === 'select' ? (<select {...register(name)}>
                        {options!.map((e) => <option value={e}>{e}</option>)}</select>
                ) : type === 'number' ? (
                    <input {...register(name)} type="number" step="any"/>
                ) : (
                    <input {...register(name)} type="text" />
                )
                }
            </div>
        );
    }

}


