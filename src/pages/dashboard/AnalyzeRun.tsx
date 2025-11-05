import type {CompletedRunData} from "@/pages/dashboard/interfaces.ts";
import styles from "./AnalyzeRun.module.css";
import {type FormEvent, useState} from "react";
import AppConfig from "../../../config.ts";
import {FaArrowLeft} from "react-icons/fa";

interface PlotConfiguration {
    startTime: number,
    endTime: number,
    plotEnergy: boolean,
    plotSpectrum: boolean,
    plotFlux: boolean,
    plotFields: boolean,
}

export default function AnalyzeRun({completedRunData,closeAnalyzeWindow}: {completedRunData: CompletedRunData,closeAnalyzeWindow: () => void}) {

    const [plotConfiguration,setPlotConfiguration] = useState<PlotConfiguration>({
        startTime: 0,
        endTime: 0,
        plotEnergy: false,
        plotSpectrum: false,
        plotFlux: false,
        plotFields: false
    });

    async function handleAnalyzeFormSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        console.log(`Submitting the form with the following values: ${JSON.stringify(plotConfiguration)}`);

        const response = await fetch(`${AppConfig.getBaseUrl()}/dashboard/analyzeRun`,
            {
                method: "POST",
                body: JSON.stringify({
                    'id': completedRunData.id,
                    'kind': completedRunData.kind,
                    ...plotConfiguration}),

                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("accessToken"),
                    "Content-Type": "application/json",
                }
            }
        );

        if(response.ok) {
            console.log('run analyzed');
        }

        // if(response.ok) {
        //     addToast("Run stopped successfully");
        //     await getActiveRuns();
        // } else {
        //     addToast("Some error occurred while stopping the run");
        // }


    }

    function handlePlotConfigurationChanged(e: React.ChangeEvent<HTMLInputElement>) {
        const {name,type,value,checked} = e.target;
        setPlotConfiguration((prev) => (
            {
                ...prev,
                [name] : type === 'checkbox' ? checked : type === 'number' ? Number(value) : e.target.value
            }
        ));
    }



    return <div className={styles.analyzeRunContainer}>
        <div className={styles.heading}>
            <FaArrowLeft onClick={closeAnalyzeWindow} size={30} color="white" /> <h1>Analyze the run</h1>

        </div>

        <form onSubmit={handleAnalyzeFormSubmit}>
            <div>
                <span><label htmlFor="startTime">Start Time:</label> <input id='startTime' name='startTime' type="number" value={plotConfiguration.startTime}  onChange={handlePlotConfigurationChanged}/></span>
                <span><label htmlFor="endTime">End Time:</label> <input id='endTime' name='endTime' type="number" value={plotConfiguration.endTime}  onChange={handlePlotConfigurationChanged}/></span>
            </div>
            
            <div>
                <span><label htmlFor="plotEnergy">Plot Energy:</label> <input name='plotEnergy' id='plotEnergy' type="checkbox" checked={plotConfiguration.plotEnergy} onChange={handlePlotConfigurationChanged}/></span>
                <span><label htmlFor="plotSpectrum">Plot Spectrum:</label> <input name='plotSpectrum' id='plotSpectrum' type="checkbox" checked={plotConfiguration.plotSpectrum} onChange={handlePlotConfigurationChanged}/></span>
                <span><label htmlFor="plotFlux">Plot Flux:</label> <input name='plotFlux' id='plotFlux' type="checkbox" checked={plotConfiguration.plotFlux}  onChange={handlePlotConfigurationChanged}/></span>
                <span><label htmlFor="plotFields">Plot Fields:</label> <input name='plotFields' id='plotFields' type="checkbox" checked={plotConfiguration.plotFields} onChange={handlePlotConfigurationChanged}/></span>
            </div>
            <button type="submit">Analyze Run</button>
        </form>

    </div>
}
