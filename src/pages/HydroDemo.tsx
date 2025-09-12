import { useForm } from 'react-hook-form';
import styles from './HydroDemo.module.css';
import { useRef, useState } from 'react';

type HydroPara = {
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
  name: keyof HydroPara, //string;
  label: string;
  type: string;
  pattern?: string;
  options?: string[];
};

// const saveModes3Pattern : string = "\\(([0-9]+),([0-9]+),([0-9]+)\\)(,\\((([0-9]+),([0-9]+),([0-9]+))\\))*";

// const saveModes2Pattern : string = "\\(([0-9]+),([0-9]+)\\)(,\\((([0-9]+),([0-9]+))\\))*";


const initialHydroPara : HydroPara = {
  device: 'CPU',
  device_rank: 0,
  dimension: 2,
  Nx: 64,
  Ny: 64,
  Nz: 64,
  nu: 0.1,
  kappa: 0.1,
  eta: 0.1,
  time_scheme: 'EULER',
  t_initial: 0.1,
  t_final: 0.01,
  dt: 0.001

}

export default function HydroDemo() {

  const {register,handleSubmit} = useForm<HydroPara>({ defaultValues: initialHydroPara});
  const [output, setOutput] = useState("");
  const resultRef = useRef<HTMLDivElement>(null);
  const [socket,setSocket] = useState<WebSocket | null>(null);
  const [running,setRunning] = useState<boolean>(false);
  
  function onSubmit(data:HydroPara) {

    if(socket && socket.readyState !== WebSocket.CLOSED) {
      socket.close();
    }

    const ws = new WebSocket("ws://localhost:8081/ws/run-exe");
    
    ws.onopen = () => {
      console.log("WebSocket connected");
      ws.send(JSON.stringify(data));
    };

    ws.onmessage = (event) => {
      setOutput((prev) => prev + event.data + "\n");
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
      setOutput(`WebSocket error occurred. ${err.target}`);
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
    };

    setSocket(ws);
    setRunning(true);
    console.log("Launching the run");
  }

  function handleClearButtonClick() {
    setOutput("");
  }

  function handleRunStop() {
    socket!.send("stop");
    // socket!.close();
    setSocket(null);
  }

  function handleStartNewRun() {
    setRunning(false);
    
  }

  return (
    <div className={styles.container}>

      { !running &&  <div className={styles.formContainer}>
      <form action="" onSubmit={handleSubmit(onSubmit)}>

        <div>
          <InputField name="device" label='Device' type="select" options={["CPU","GPU"]} />
          <InputField name='device_rank' label='Device Rank' type='number' />
          <InputField name='dimension' label='Dimension' type='select' options={["1","2","3"]} />
        </div>
        
        <div>
          <InputField name='Nx' label="Nx" type='select' options={["64","128","256"]} />
          <InputField name='Ny' label='Ny' type='select' options={["64","128","256"]} />
          <InputField name='Nz' label='Nz' type='select' options={["64","128","256"]} />
        </div>

        <div>
            <InputField name='nu' label='Nu' type='number' />
            <InputField name='eta' label='Eta' type='number' />
        </div>

        <div>
          <InputField name='time_scheme' label='Time Scheme' type='select' options={["EULER","RK2","RK4"]} />
          <InputField name='t_initial' label='Initial Time' type='number' />
          <InputField name='t_final' label='Final Time' type='number' />
          <InputField name='dt' label='Dt' type='number' />
        </div>
        
        <button className={styles.runButton}>Run</button>
        
      </form>
    </div> }
    
      { running && <div className={styles.resultContainer}>
        <div>

        <button className={styles.clearButton} onClick={handleClearButtonClick}>Clear Output</button>
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
      <label htmlFor={name}>{label}</label>
      {type === 'select' ? (<select {...register(name)}>
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


