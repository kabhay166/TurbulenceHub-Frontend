import { useState } from 'react';
import styles from './Data.module.css';
import { FaSearch } from 'react-icons/fa';
import { FaFilter } from 'react-icons/fa';
import { FaDownload } from 'react-icons/fa';
import AppConfig from "../../config.ts";


const eulerTableHeaders: string[] = ["Dimension","Resolution","Initial Condition","Initial Time","Final Time","Download","Description"]
const hydroTableHeaders: string[] = ["Dimension","Resolution","Initial Condition","Viscosity","Initial Time","Final Time","Download","Description"];
const mhdTableHeaders: string[] = ["Dimension","Resolution","Initial Condition","Viscosity","Magnetic Diffusivity","Initial Time","Final Time","Download","Description"]
const rbcTableHeaders: string[] = ["Dimension","Resolution","Initial Condition","Initial Time","Final Time","Download","Description"]

interface EulerData {
  id: number,
  dimension: number,
  resolution: string,
  initialCondition: string,
  tinitial: number,
  tfinal: number,
  downloadPath: string,
  description: string,
}

interface HydroData extends EulerData {
  viscosity: number
}

interface MhdData extends EulerData {
  viscosity: number,
  magneticDiffusivity: number
}

interface RbcData extends EulerData {
    rayleighNumber:number;
}


interface DataFilter {
  dimension              : [number, number],
  resolutionX            : [number, number],
  resolutionY            : [number, number],
  resolutionZ            : [number, number],
  initialTime            : [number, number],
  finalTime              : [number, number],
  viscosity              : [number, number],
  magneticDiffusivity    : [number, number],

  // for scalar
  criticalRayleighNumber : [number | null, number | null],
  rayleighNumber         : [number | null, number | null],
  prandtlNumber          : [number | null, number | null],
  thermalDiffusivity     : [number | null, number | null],
}



async function downloadData(model: string, id:number) {
  console.log(`downloading data: ${model}`)
  window.location.href =  AppConfig.getDownloadUrl(model,id) //`${DownloadPath}/${model}/${id}`;
}


const initialFilter: DataFilter = {dimension: [-1,-1],resolutionX: [-1,-1],resolutionY: [-1,-1],resolutionZ: [-1,-1],initialTime: [-1,-1],finalTime: [-1,-1], viscosity: [-1,-1], magneticDiffusivity: [-1,-1], criticalRayleighNumber: [-1,-1], rayleighNumber: [-1,-1], prandtlNumber: [-1,-1], thermalDiffusivity: [-1,-1]};

export default function Data() {

  const [selectedModel, setSelectedModel] = useState("");
  const [showFilterWindow, setShowFilterWindow] = useState(false);

  const [eulerData,setEulerData] = useState<EulerData[]>([]);
  const [hydroData,setHydroData] = useState<HydroData[]>([]);
  const [mhdData,setMhdData] = useState<MhdData[]>([]);
  const [rbcData,setRbcData] = useState<RbcData[]>([]);

  const [filters,setFilters] = useState<DataFilter>(initialFilter);

  function toggleFilterWindow() {
    setShowFilterWindow((showFilterWindow) => !showFilterWindow);
  }


  function handleModelChanged(e:React.ChangeEvent<HTMLSelectElement>) {
    setSelectedModel(e.target.value);
    fetchData(e.target.value);
    setFilters(initialFilter);
  }

  function handleSearch() {
      fetchData(selectedModel);
  }

  async function fetchData(selectedModel: string) {
    let dataList : EulerData[] | HydroData[] | MhdData[] | RbcData[] = [];

    try {
    const dataResponse : Response = await fetch(`${AppConfig.getDataUrl()}/${selectedModel.toLowerCase()}`,{
      method: "GET"
    });
    
    if(dataResponse.ok) {
      dataList = await dataResponse.json();
    }
    } catch(e : unknown) {
        console.log(`Unexpected error occured. ${e}`);
    }
    
    console.log('fetch data called');
    if(selectedModel == 'Euler') {
      setEulerData(dataList);
    } else if(selectedModel == 'Hydro') {
      const hydroData = dataList as HydroData[];
      setHydroData(hydroData);
    } else if(selectedModel == 'MHD') {
      const mhdData = dataList as MhdData[];
      setMhdData(mhdData);
    } else if(selectedModel == 'RBC') {
        const rbcData = dataList as RbcData[];
        setRbcData(rbcData);
    }

  }

  function handleFilterChanged(filters: DataFilter): void {
    setFilters(filters);
    filterData(selectedModel,filters);
  }


  async function filterData(model: string, filters: DataFilter) : Promise<void> {
    console.log('filtering data');
    console.log(filters.dimension);

    let filteredData : EulerData[] | HydroData[] | MhdData[]  = [];
    
    try {
    
    const dataResponse : Response = await fetch(`${AppConfig.getDataUrl()}/${model.toLowerCase()}`,{
      method: "GET"
    });
    
    if(dataResponse.ok) {
      filteredData = await dataResponse.json();
    }
    } catch(e : unknown) {
        console.log(`Unexpected error occured. ${e}`);
    }

    // for dimension
    if(filters.dimension[0] !== -1 && filters.dimension[1] !== -1){
      filteredData = filteredData.filter((dataItem) => {
      return dataItem.dimension >= filters.dimension[0] && dataItem.dimension <= filters.dimension[1];
      }
        );
    } else if(filters.dimension[0] !== -1 && filters.dimension[1] === -1){
      filteredData = filteredData.filter((dataItem) => {
      return dataItem.dimension >= filters.dimension[0];
      }
        );
    } else if(filters.dimension[0] === -1 && filters.dimension[1] !== -1){
      filteredData = filteredData.filter((dataItem) => {
      return dataItem.dimension <= filters.dimension[1];
      }
        );
    }
    //

    // for X resolution
    if(filters.resolutionX[0] !== -1 && filters.resolutionX[1] !== -1){
      filteredData = filteredData.filter((dataItem) => {
      const dataResolutionX = Number(dataItem.resolution.split('x')[0]);
      return dataResolutionX >= filters.resolutionX[0] && dataResolutionX <= filters.resolutionX[1];
      }
        );
    } else if(filters.resolutionX[0] !== -1 && filters.resolutionX[1] === -1){
      filteredData = filteredData.filter((dataItem) => {
      console.log('this filter');

      const dataResolutionX = Number(dataItem.resolution.split('x')[0]);
      return dataResolutionX >= filters.resolutionX[0];
      }
        );
    } else if(filters.resolutionX[0] === -1 && filters.resolutionX[1] !== -1){
      filteredData = filteredData.filter((dataItem) => {
      const dataResolutionX = Number(dataItem.resolution.split('x')[0]);
      return dataResolutionX <= filters.resolutionX[1];
      }
        );
    }
    //

    // for y resolution
    if(filters.resolutionY[0] !== -1 && filters.resolutionY[1] !== -1){
      filteredData = filteredData.filter((dataItem) => {
      const dataResolutionY = Number(dataItem.resolution.split('x')[1]);
      return dataResolutionY >= filters.resolutionY[0] && dataResolutionY <= filters.resolutionY[1];
      }
        );
    } else if(filters.resolutionY[0] !== -1 && filters.resolutionY[1] === -1){
      filteredData = filteredData.filter((dataItem) => {
      const dataResolutionY = Number(dataItem.resolution.split('x')[1]);
      return dataResolutionY >= filters.resolutionY[0];
      }
        );
    } else if(filters.resolutionY[0] === -1 && filters.resolutionY[1] !== -1){
      filteredData = filteredData.filter((dataItem) => {
      const dataResolutionY = Number(dataItem.resolution.split('x')[1]);
      return dataResolutionY <= filters.resolutionY[1];
      }
        );
    }
    //

    // for Z resolution
    if(filters.resolutionZ[0] !== -1 && filters.resolutionZ[1] !== -1){
      filteredData = filteredData.filter((dataItem) => {
      const dataResolutionZ = Number(dataItem.resolution.split('x')[2]);
      return dataResolutionZ >= filters.resolutionY[0] && dataResolutionZ <= filters.resolutionY[1];
      }
        );
    } else if(filters.resolutionZ[0] !== -1 && filters.resolutionZ[1] === -1){
      filteredData = filteredData.filter((dataItem) => {
      const dataResolutionZ = Number(dataItem.resolution.split('x')[2]);
      return dataResolutionZ >= filters.resolutionZ[0];
      }
        );
    } else if(filters.resolutionZ[0] === -1 && filters.resolutionZ[1] !== -1){
      filteredData = filteredData.filter((dataItem) => {
      const dataResolutionZ = Number(dataItem.resolution.split('x')[2]);
      return dataResolutionZ <= filters.resolutionZ[1];
      }
        );
    }
    //

    // for initial time
    if(filters.initialTime[0] !== -1 && filters.initialTime[1] !== -1){
      filteredData = filteredData.filter((dataItem) => {
      return dataItem.tinitial >= filters.initialTime[0] && dataItem.tinitial <= filters.initialTime[1];
      }
        );
    } else if(filters.initialTime[0] !== -1 && filters.initialTime[1] === -1){
      filteredData = filteredData.filter((dataItem) => {
      return dataItem.tinitial >= filters.initialTime[0];
      }
        );
    } else if(filters.initialTime[0] === -1 && filters.initialTime[1] !== -1){
      filteredData = filteredData.filter((dataItem) => {
      return dataItem.tinitial <= filters.initialTime[1];
      }
        );
    }
    //

    // for final time
    if(filters.finalTime[0] !== -1 && filters.finalTime[1] !== -1){
      filteredData = filteredData.filter((dataItem) => {
      return dataItem.tfinal >= filters.finalTime[0] && dataItem.tfinal <= filters.finalTime[1];
      }
        );
    } else if(filters.finalTime[0] !== -1 && filters.finalTime[1] === -1){
      filteredData = filteredData.filter((dataItem) => {
      return dataItem.tfinal >= filters.finalTime[0];
      }
        );
    } else if(filters.finalTime[0] === -1 && filters.finalTime[1] !== -1){
      filteredData = filteredData.filter((dataItem) => {
      return dataItem.tfinal <= filters.finalTime[1];
      }
        );
    }
    //
    

     // for viscosity
    if(selectedModel === 'Hydro' || selectedModel === 'MHD') {
          if(filters.viscosity[0] !== -1 && filters.viscosity[1] !== -1){
                filteredData = filteredData.filter((item) => {
                const dataItem = item as HydroData | MhdData;
                return dataItem.viscosity >= filters.viscosity[0] && dataItem.viscosity <= filters.viscosity[1];
                }
                  );
              } else if(filters.viscosity[0] !== -1 && filters.viscosity[1] === -1){
                filteredData = filteredData.filter((item) => {
                const dataItem = item as HydroData | MhdData;
                return dataItem.viscosity >= filters.viscosity[0];
                }
                  );
              } else if(filters.viscosity[0] === -1 && filters.viscosity[1] !== -1){
                filteredData = filteredData.filter((item) => {
                const dataItem = item as HydroData | MhdData;
                return dataItem.viscosity <= filters.viscosity[1];
                }
                  );
              }
    }
    //

     // for magnetic diffusivity
    if(selectedModel === 'MHD') {
          if(filters.magneticDiffusivity[0] !== -1 && filters.magneticDiffusivity[1] !== -1){
                filteredData = filteredData.filter((item) => {
                const dataItem = item as MhdData;
                console.log(dataItem.magneticDiffusivity,filters.magneticDiffusivity[1]);
                return dataItem.magneticDiffusivity >= filters.magneticDiffusivity[0] && dataItem.magneticDiffusivity <= filters.magneticDiffusivity[1];
                }
                  );
              } else if(filters.magneticDiffusivity[0] !== -1 && filters.magneticDiffusivity[1] === -1){
                filteredData = filteredData.filter((item) => {
                const dataItem = item as MhdData;
                return dataItem.magneticDiffusivity >= filters.magneticDiffusivity[0];
                }
                  );
              } else if(filters.magneticDiffusivity[0] === -1 && filters.magneticDiffusivity[1] !== -1){
                filteredData = filteredData.filter((item) => {
                const dataItem = item as MhdData;
                return dataItem.magneticDiffusivity <= filters.magneticDiffusivity[1];
                }
                  );
              }
    }
    //

    


    if(model == 'Euler') {
      console.log('setting euler data');
      setEulerData(filteredData);
    }
    else if(model == 'Hydro') {
      const data = filteredData as HydroData[];
      console.log('setting hydro data');
      setHydroData(data);
    }
    else if(model == 'MHD') {
      const data = filteredData as MhdData[];
      console.log('setting mhd data');
      setMhdData(data);
    }
  
  }

  return (
    <div className={styles.container}>
      <select name="modelSelector" className={styles.modelSelector} value={selectedModel} onChange={handleModelChanged}>
        <option value="" disabled>Choose the model</option>
        <option value="Euler">Euler</option>
        <option value="Hydro">Hydro</option>
        <option value="MHD">MHD</option>
        <option value="RBC">RBC</option>
        <option value="Scalar">Scalar</option>
      </select>
      <button className={styles.searchButton} onClick={handleSearch}><FaSearch /> </button>
      
      <button className={styles.filterButton} onClick={toggleFilterWindow}><FaFilter color={showFilterWindow ? 'blue' : 'black'} /></button>
      {showFilterWindow &&
      <FilterWindow selectedModel={selectedModel} closeFilterWindow={toggleFilterWindow} filters={filters} onFilterChanged={handleFilterChanged} />}

      <div className={styles.searchResultContainer}>
        {selectedModel == "Euler" && <EulerTable eulerDataList={eulerData}/>}
        {selectedModel == "Hydro" &&  <HydroTable hydroDataList={hydroData}/>}
        {selectedModel == "MHD" &&  <MHDTable mhdDataList={mhdData} />}
        {selectedModel == "RBC" && <RBCTable rbcDataList={rbcData}/>}
      </div>
    
    </div>
  )
}


function EulerTable( {eulerDataList} : {eulerDataList: EulerData[]}) {
  return <>
    <table>
      <thead>
        <tr>
      {eulerTableHeaders.map((e) => <th colSpan={ e =='Description' ? 4 : 1}>{e}</th>)}
        </tr>
      </thead>
      <tbody>
        {eulerDataList.map(e => (
          <tr key={e.id}>
            <td>{e.dimension}</td>
            <td>{e.resolution}</td>
            <td>{e.initialCondition}</td>
            <td>{e.tinitial}</td>
            <td>{e.tfinal}</td>
            <td><FaDownload onClick={ () => downloadData('Euler',e.id)} /></td>
            <td>{e.description}</td>
          </tr>
        ) )}
        
      </tbody>
    </table> </>
}

function HydroTable({hydroDataList } : { hydroDataList: HydroData[]}) {
  return <>
    <table>
      <thead>
        <tr>
      {hydroTableHeaders.map((e) => <th colSpan={ e =='Description' ? 4 : 1}>{e}</th>)}
        </tr>
      </thead>
      <tbody>
        {hydroDataList.map(e => (
          <tr key={e.id}>
            <td>{e.dimension}</td>
            <td>{e.resolution}</td>
            <td>{e.initialCondition}</td>
            <td>{e.viscosity}</td>
            <td>{e.tinitial}</td>
            <td>{e.tfinal}</td>
            <td><FaDownload onClick={ () => downloadData('Hydro',e.id)} /></td>
            <td>{e.description}</td>
          </tr>
        ) )}
      </tbody>
    </table>
  </>
}

function MHDTable( {mhdDataList } : { mhdDataList: MhdData[]}) {
  return <>
    <table>
      <thead>
        <tr>
      {mhdTableHeaders.map((e) => <th colSpan={ e =='Description' ? 4 : 1}>{e}</th>)}
        </tr>
      </thead>
      <tbody>
        {mhdDataList.map(e => (
          <tr key={e.id}>
            <td>{e.dimension}</td>
            <td>{e.resolution}</td>
            <td>{e.initialCondition}</td>
            <td>{e.viscosity}</td>
            <td>{e.magneticDiffusivity}</td>
            <td>{e.tinitial}</td>
            <td>{e.tfinal}</td>
            <td><FaDownload onClick={ () => downloadData('MHD',e.id)} /></td>
            <td>{e.description}</td>
          </tr>
        ) )}
      </tbody>
    </table>
  </>
}

function RBCTable( {rbcDataList} : {rbcDataList: RbcData[]}) {
    return <>
        <table>
            <thead>
            <tr>
                {rbcTableHeaders.map((e) => <th colSpan={ e =='Description' ? 4 : 1}>{e}</th>)}
            </tr>
            </thead>
            <tbody>
            {rbcDataList.map(e => (
                <tr key={e.id}>
                    <td>{e.dimension}</td>
                    <td>{e.resolution}</td>
                    <td>{e.initialCondition}</td>
                    <td>{e.tinitial}</td>
                    <td>{e.tfinal}</td>
                    <td><FaDownload onClick={ () => downloadData('RBC',e.id)} /></td>
                    <td>{e.description}</td>
                </tr>
            ) )}

            </tbody>
        </table> </>
}

function FilterWindow({selectedModel,closeFilterWindow,filters,onFilterChanged} : {selectedModel : string, closeFilterWindow : () => void,filters: DataFilter,onFilterChanged: (filters: DataFilter) => void}) {
  
  const [selectedFilters, setSelectedFilters] = useState(filters);

  function handleFilterChange(id:keyof DataFilter,index:number,val:number) {
    console.log('Inside function');
    const updatedFilters : DataFilter = {...selectedFilters, [id] : [...selectedFilters[id]]};
    updatedFilters[id][index] = val;
    console.log(updatedFilters);
    setSelectedFilters(updatedFilters);
  }

  function applyFilters() {
    onFilterChanged(selectedFilters);
  }
  
  if(selectedModel == "") {
    return <div className={styles.filterContainer} style={{width: '50px',height:'50px'}}>
      <p>Please select a model to get filter options</p>
    </div>
  }
  return <div className={styles.filterContainer}>
    <div>
      <p>Select Filters</p>
      <button onClick={closeFilterWindow}>X</button>
    </div>
    <p>Dimension:</p>
    <label htmlFor="dimensionFrom">from:</label>
    <select name="dimensionFrom" id="dimensionFrom" value={selectedFilters.dimension[0]} onChange={(e) => handleFilterChange("dimension",0, Number(e.target.value))}>
      <option value="-1">All</option>
      <option value="3">3</option>
      <option value="2">2</option>
      <option value="1">1</option>
    </select>

    <label htmlFor="dimensionTo">to:</label>
    <select name="dimensionTo" id="dimensionTo" value={selectedFilters.dimension[1]} onChange={(e) => handleFilterChange("dimension",1, Number(e.target.value))}>
      <option value="-1">All</option>
      <option value="3">3</option>
      <option value="2">2</option>
      <option value="1">1</option>
    </select>

    <br></br>

    <p>Resolution X:</p>
    <label htmlFor="resolutionXFrom">from:</label>
    <select id="resolutionXFrom" value={selectedFilters.resolutionX[0]} onChange={(e) => handleFilterChange("resolutionX",0, Number(e.target.value))}>
      <option value="-1" >All</option>
      <option value="128">128</option>
      <option value="256">256</option>
      <option value="512">512</option>
    </select>

    <label htmlFor="resolutionXTo">to:</label>
    <select id="resolutionXFrom" value={selectedFilters.resolutionX[1]} onChange={(e) => handleFilterChange("resolutionX",1, Number(e.target.value))}>
      <option value="-1" >All</option>
      <option value="128">128</option>
      <option value="256">256</option>
      <option value="512">512</option>
    </select>
    <br></br>

    <p>Resolution Y:</p>
    <label htmlFor="resolutionYFrom">from:</label>
    <select id="resolutionYFrom" value={selectedFilters.resolutionY[0]} onChange={(e) => handleFilterChange("resolutionY", 0, Number(e.target.value))}>
      <option value="-1" >All</option>
      <option value="128">128</option>
      <option value="256">256</option>
      <option value="512">512</option>
    </select>

    <label htmlFor="resolutionYTo">to:</label>
    <select id="resolutionYTo" value={selectedFilters.resolutionY[1]} onChange={(e) => handleFilterChange("resolutionY", 1, Number(e.target.value))}>
      <option value="-1" >All</option>
      <option value="128">128</option>
      <option value="256">256</option>
      <option value="512">512</option>
    </select>

    <br />

    <p>Resolution Z:</p>
    <label htmlFor="resolutionZFrom">from:</label>
    <select id="resolutionZFrom" value={selectedFilters.resolutionZ[0]} onChange={(e) => handleFilterChange("resolutionZ", 0, Number(e.target.value))}>
      <option value="-1" >All</option>
      <option value="128">128</option>
      <option value="256">256</option>
      <option value="512">512</option>
    </select>

    <label htmlFor="resolutionZTo">to:</label>
    <select id="resolutionZTo" value={selectedFilters.resolutionY[1]} onChange={(e) => handleFilterChange("resolutionZ", 1, Number(e.target.value))}>
      <option value="-1" >All</option>
      <option value="128">128</option>
      <option value="256">256</option>
      <option value="512">512</option>
    </select>

    <br />

    <p>Initial Time:</p>
    <label htmlFor="initialTimeFrom">from:</label>
    <input type="number" id='initialTimeFrom' value={selectedFilters.initialTime[0] === -1 ? '' : selectedFilters.initialTime[0]} onChange={(e) => handleFilterChange("initialTime", 0, Number(e.target.value === '' ? -1 : e.target.value))}/>
    
    <label htmlFor="initialTimeTo">to:</label>
    <input type="number" id='initialTimeTo' value={selectedFilters.initialTime[1] === -1 ? '' : selectedFilters.initialTime[1]} onChange={(e) => handleFilterChange("initialTime", 1, Number(e.target.value === '' ? -1 : e.target.value))}/>

    <br />

    <p>Final Time:</p>
    <label htmlFor="finalTimeFrom">from:</label>
    <input type="number" id='finalTimeFrom' value={selectedFilters.finalTime[0] === -1 ? '' : selectedFilters.finalTime[0]} onChange={(e) => handleFilterChange("finalTime", 0, Number(e.target.value === '' ? -1 : e.target.value))}/>
    
    <label htmlFor="finalTimeTo">to:</label>
    <input type="number" id='finalTimeTo' value={selectedFilters.finalTime[1] === -1 ? '' : selectedFilters.finalTime[1]} onChange={(e) => handleFilterChange("finalTime", 1, Number(e.target.value === '' ? -1 : e.target.value))}/>

    <br />
    {
      (selectedModel == 'Hydro' || selectedModel == 'MHD') &&
      <>
      <p>Viscosity:</p>
      <label htmlFor="viscosityFrom">from:</label>
      <input type="number" id='viscosityFrom' value={selectedFilters.viscosity[0] === -1 ? '' : selectedFilters.viscosity[0]} onChange={(e) => handleFilterChange("viscosity", 0, Number(e.target.value === '' ? -1 : e.target.value))}/>
      
      <label htmlFor="viscosityTo">to:</label>
      <input type="number" id='viscosityTo' value={selectedFilters.viscosity[1] === -1 ? '' : selectedFilters.viscosity[1]} onChange={(e) => handleFilterChange("viscosity", 1, Number(e.target.value === '' ? -1 : e.target.value))}/>
      <br />
      </>
    }
    
    {
      (selectedModel == 'MHD') &&
      <>
      <p>Magnetic Diffusivity:</p>
      <label htmlFor="magneticDiffusivityFrom">from:</label>
      <input type="number" id='magneticDiffusivityFrom' value={selectedFilters.magneticDiffusivity[0] === -1 ? '' : selectedFilters.magneticDiffusivity[0]} onChange={(e) => handleFilterChange("magneticDiffusivity", 0, Number(e.target.value === '' ? -1 : e.target.value))}/>
      
      <label htmlFor="magneticDiffusivityTo">to:</label>
      <input type="number" id='magneticDiffusivityTo' value={selectedFilters.magneticDiffusivity[1] === -1 ? '' : selectedFilters.magneticDiffusivity[1]} onChange={(e) => handleFilterChange("magneticDiffusivity", 1, Number(e.target.value === '' ? -1 : e.target.value))}/>
      <br />
      </>
    }


    <div className={styles.filterActionButtons}>
      <button onClick={applyFilters}>Apply</button>
      <button onClick={closeFilterWindow}>Close</button>
    </div>
  </div>
}