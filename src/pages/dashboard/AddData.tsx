import styles from "./AddData.module.css";
import {useState} from "react";
import AppConfig from "../../../config.ts";
import {ToastTypes} from "@/contexts/ToastContext.tsx";
import {useToast} from "@/hooks/UseToast.tsx";
import api from "@/services/api_service.ts";

interface GenericDataParameters {
    kind:                   string;
    dimension:              number;
    resolution:             string;
    initialCondition:       string;
    downloadPath:           string;
    description:            string;
    tInitial:               number;
    tFinal:                 number;
    viscosity:              number;
    magneticDiffusivity:    number;
    rayleighNumber:         number;
    prandtlNumber:          number;

}

const initialParameters : GenericDataParameters = {
    kind: 'Euler',
    dimension: 3,
    resolution: "",
    initialCondition: "",
    downloadPath: "",
    description: "",
    tInitial: 0,
    tFinal: 0,
    viscosity: 0,
    magneticDiffusivity: 0,
    rayleighNumber: 0,
    prandtlNumber: 0,
}

export default function AddData() {

    const [parameters,setParameters] = useState<GenericDataParameters>(initialParameters);
    const {addToast} = useToast();

    function handleValueChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;

        let newValue: string | number = value;

        if (["dimension", "tInitial", "tFinal", "viscosity", "magneticDiffusivity", "rayleighNumber","prandtlNumber"].includes(name)) {
            newValue = value === "" ? 0 : Number(value);
        }

        setParameters({
            ...parameters,
            [name]: newValue,
        });
    }

    async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            const dataAddResponse = await api.post(
                AppConfig.getAddDataUrl(),
                parameters,
                { responseType: 'text' });

            if(dataAddResponse.status == 200) {
                addToast('Data added successfully',ToastTypes.success);
            } else {
                const responseMessage = await dataAddResponse.data;
                addToast(responseMessage,ToastTypes.error);
            }


            setParameters(initialParameters);
        } catch(e : unknown) {
            console.log(`Unexpected error occurred. ${e}`);
            addToast(`Unexpected error occurred. ${e}`,ToastTypes.error);
        }
        console.log(JSON.stringify(parameters));
    }

    return (
    <div className={styles.addDataContainer}>

        <h1>Add a new data</h1>
        <form onSubmit={handleFormSubmit}>

            <CommonParameters parameters={parameters} handleValueChange={handleValueChange} />

            {parameters.kind == "Hydro" && <HydroParameters parameters={parameters} handleValueChange={handleValueChange} />}
            {parameters.kind == "MHD" && <MHDParameters parameters={parameters} handleValueChange={handleValueChange} />}
            {parameters.kind == "RBC" && <RBCParameters parameters={parameters} handleValueChange={handleValueChange} />}

            <button type="submit">Add Data</button>
        </form>
    </div>
    )
}

function CommonParameters({parameters,handleValueChange} : {parameters:GenericDataParameters,handleValueChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void}) {
    return <>
        <span>
            <label htmlFor="kind">Model:</label>
            <select name="kind" id="kind" value={parameters.kind} onChange={handleValueChange}>
                <option value="Euler">Euler</option>
                <option value="Hydro">Hydro</option>
                <option value="MHD">MHD</option>
                <option value="RBC">RBC</option>
                <option value="Miscellaneous">Miscellaneous</option>
            </select>
            </span>
        <br/>
        { parameters.kind != "Miscellaneous" &&
            <>
                <span>
                <label htmlFor="dimension">Dimension:</label>
                <select name="dimension" id="dimension" value={parameters.dimension} onChange={handleValueChange}>
                <option value="3">3</option>
                <option value="2">2</option>
                <option value="1">1</option>
            </select>
            </span>
                <br/>
            </>
        }


        <span>
                <label htmlFor="resolution">Resolution:</label>
                <input type="text" name="resolution" id="resolution" value={parameters.resolution} onChange={handleValueChange}/>
            </span>
        <br/>


        <span>
                <label htmlFor="initialCondition">Initial Condition:</label>
                <input type="text" name="initialCondition" id="initialCondition" value={parameters.initialCondition} onChange={handleValueChange} />
            </span>
        <br/>

        { parameters.kind != "Miscellaneous" &&
        <>
            <span>
                <label htmlFor="tInitial">Initial Time:</label>
                <input type="number" step="any" name="tInitial" id="tInitial" value={parameters.tInitial} onChange={handleValueChange}/>
            </span>
        <br/>
        </>}
        { parameters.kind != "Miscellaneous" &&
            <>
        <span>
                <label htmlFor="tFinal">Final Time:</label>
                <input type="number" step="any" name="tFinal" id="tFinal" value={parameters.tFinal} onChange={handleValueChange}/>
            </span>

        <br/></>
        }
        <span>
                <label htmlFor="description">Description:</label>
                <input type="text" name="description" id="description" value={parameters.description} onChange={handleValueChange} />
            </span>
        <br/>
        <span>
                <label htmlFor="downloadPath">Data Folder:</label>
                <input type="text" name="downloadPath" id="downloadPath" value={parameters.downloadPath} onChange={handleValueChange} />
            </span>
        <br/>


    </>;
}

function HydroParameters({parameters,handleValueChange} : {parameters:GenericDataParameters,handleValueChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void}) {
    return <>
            <span>
                <label htmlFor="viscosity">Viscosity:</label>
                <input type="number" step="any" name="viscosity" id="viscosity" value={parameters.viscosity} onChange={handleValueChange}/>
            </span>
    </>
}

function MHDParameters({parameters,handleValueChange} : {parameters:GenericDataParameters,handleValueChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void}) {
    return <>
            <span>
                <label htmlFor="viscosity">Viscosity:</label>
                <input type="number" step="any" name="viscosity" id="viscosity" value={parameters.viscosity} onChange={handleValueChange}/>
            </span>
        <br/>
        <span>
                <label htmlFor="magneticDiffusivity">Magnetic Diffusivity:</label>
                <input type="number" step="any" name="magneticDiffusivity" id="magneticDiffusivity" value={parameters.magneticDiffusivity} onChange={handleValueChange}/>
            </span>
    </>
}

function RBCParameters({parameters,handleValueChange} : {parameters:GenericDataParameters,handleValueChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void}) {
    return <>
            <span>
                <label htmlFor="rayleighNumber">Rayleigh Number:</label>
                <input type="number" step="any" name="rayleighNumber" id="rayleighNumber" value={parameters.rayleighNumber} onChange={handleValueChange}/>
            </span>
        <br/>
        <span>
                <label htmlFor="prandtlNumber">Prandtl Number:</label>
                <input type="number" step="any" name="prandtlNumber" id="prandtlNumber" value={parameters.prandtlNumber} onChange={handleValueChange}/>
            </span>
    </>
}
