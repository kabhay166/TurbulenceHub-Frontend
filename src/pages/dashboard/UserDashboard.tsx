import styles from "./UserDashboard.module.css";
import {useEffect, useState} from "react";
import PieChart from "../../components/PieChart.tsx";
import defaultUserImg from "../../assets/default_user_image.jpg";
import AppConfig from "../../../config.ts";
import useUserStore from "@/globals/userStore.ts";
import ActiveRuns from "@/pages/dashboard/ActiveRuns.tsx";
import CompletedRuns from "@/pages/dashboard/CompletedRuns.tsx";

interface RunData  {
    kind:string,
    dimension: number,
    timeOfRun: string,
}


interface CompletedRunData {
    id:string,
    kind:string,
    dimension:string,
    resolution:string,
    timeOfRun:string,
}

export default function UserDashboard() {

    const [selectedSection,setSelectedSection] = useState('ActiveRuns');

    const [allRunData,setAllRunData] = useState<RunData[]>([]);
    const [recentRunData,setRecentRunData] = useState<RunData[]>([]);
    const [completedRunData,setCompletedRunData] = useState<CompletedRunData[]>([]);

    const userStore = useUserStore();

    function changeSection(section:string) {
        if(section !== selectedSection) {
            setSelectedSection(section);
        }
    }


    async function getAllRuns() {
        const response = await fetch(`${AppConfig.getBaseUrl()}/dashboard/allRuns`,

            {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("accessToken")
                }
            }
            );

        if(response.ok) {
            const runsData = await response.json();
            setAllRunData(runsData);

        }
    }

    async function getRecentRuns() {
        const response = await fetch(`${AppConfig.getBaseUrl()}/dashboard/recentRuns`,

            {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("accessToken")
                }
            }
        );

        if(response.ok) {
            const runsData = await response.json();
            setRecentRunData(runsData);

        }
    }

    async function getCompletedRuns() {
        const response = await fetch(`${AppConfig.getBaseUrl()}/dashboard/completedRuns`,

            {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("accessToken")
                }
            }
        );

        if(response.ok) {
            const runsData = await response.json();
            setCompletedRunData(runsData);
        }
    }

    useEffect(() => {
        getAllRuns();
        getRecentRuns();
        getCompletedRuns();
    },[])

    return <div className={styles.container}>
        <div className={styles.sidebar}>

            <UserCard username={userStore.user.username ?? 'User'} />
            <ul>
                <li onClick={() => changeSection('ActiveRuns')}>Active Runs</li>
                <li onClick={() => changeSection('CompletedRuns')}>Completed Runs</li>
                <li onClick={() => changeSection('RunStatistics')}>Run Statistics</li>
            </ul>

        </div>

        <div className={styles.mainContentContainer}>
            {selectedSection === 'ActiveRuns' && <ActiveRuns /> }
            {selectedSection === 'CompletedRuns' && <CompletedRuns completedRunData={completedRunData} /> }
            {selectedSection === 'RunStatistics' && <RunStatistics runData={allRunData} recentRunData={recentRunData} />}
        </div>



    </div>
}

function Card({label, value} : {label:string, value:string}) {
    return <div className={styles.card}>
        <p>{label}</p>
        <p>{value} runs</p>
    </div>;
}

function UserCard({username} : {username: string}) {
    return <div className={styles.userCard}>
        <img width={24} height={24} src={defaultUserImg} alt="User image"/>
        <p>Hi, {username}</p>
    </div>
}


function RunStatistics({runData,recentRunData} : {runData: RunData[],recentRunData: RunData[]}) {

    const [type,setType] = useState("KIND");

    let numHydroRuns : number = 0;
    let numMhdRuns : number = 0;

    let num2DRuns : number = 0;
    let num3DRuns : number = 0;


    runData.forEach((item:RunData)=> {
        if(item.kind.toLowerCase() == "hydro") {
            numHydroRuns += 1
        } else if(item.kind.toLowerCase() == "mhd") {
            numMhdRuns += 1;
        }

        if(item.dimension == 2) {
            num2DRuns += 1;
        } else if(item.dimension == 3) {
            num3DRuns += 1;
        }
    });


    const kindPieChartData = [
        {label: "Hydro",value: numHydroRuns},
        {label: "Mhd", value: numMhdRuns},
    ];

    const dimensionPieChartData = [
        {label: "2D", value: num2DRuns},
        {label: "3D", value: num3DRuns},
    ];

    const topCards = {"Today": 0, "This week": 0, "This month" : 0, "This year" : 0};

    runData.forEach((runItem) => {
        if(new Date(Date.parse(runItem.timeOfRun)).getDate() == new Date().getDate()) {
            topCards["Today"] += 1;
        }

        if(new Date(Date.parse(runItem.timeOfRun)).getMonth() == new Date().getMonth()) {
            topCards["This month"] += 1;
        }

        if(new Date(Date.parse(runItem.timeOfRun)).getFullYear() == new Date().getFullYear()) {
            topCards["This year"] += 1;
        }

        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - (startOfWeek.getDay() + 6)%7);
        startOfWeek.setHours(0,0,0,0,);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23,59,59,999);

        if(new Date(runItem.timeOfRun) >= startOfWeek && new Date(runItem.timeOfRun) <= endOfWeek) {
            topCards["This week"] += 1;
        }

    });

    return <div className={styles.runStatisticsContainer}>

        <div className={styles.cardContainer}>

            <Card label={'Today'} value={topCards["Today"].toString()} />
            <Card label={'This week'} value={topCards["This week"].toString()} />
            <Card label={'This month'} value={topCards["This month"].toString()} />
            <Card label={'This year'} value={topCards["This year"].toString()} />
        </div>

            <div className={styles.mainContainer}>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="KIND">KIND</option>
                    <option value="DIMENSION">DIMENSION</option>
                </select>
                <div className={styles.chartAndRecentContainer}>
                    <PieChart data={ type == "KIND" ? kindPieChartData : dimensionPieChartData} className={styles.chartContainer} />
                    <RecentContainer runData={recentRunData} />
                </div>
            </div>
    </div>
}


function RecentContainer({runData} : {runData: RunData[]}) {
    return <div className={styles.recentContainer}>
        <p>Recent Activity</p>
        <div className={styles.recentCardContainer}>
            {
                runData.map(activity => {
                    return  <RecentCard cardData={activity} />
                })
            }
        </div>

    </div>
}

function RecentCard({ cardData }: { cardData: RunData }) {
    return (
        <div className={styles.recentCard}>
            <div>
                <p>{cardData.kind}</p>
                <p>{cardData.dimension}D</p>
            </div>
            <div>
                <p>{new Date(Date.parse(cardData.timeOfRun)).toDateString()}</p>
                <p>{new Date(Date.parse(cardData.timeOfRun)).toLocaleTimeString()}</p>
            </div>
        </div>
    );
}


// function CompletedRuns({ completedRunData } : { completedRunData : CompletedRunData[] }) {
//     return (
//         <div >
//             <h1>Completed Runs</h1>
//             <div className={styles.completedRunsContainer}>
//                 {completedRunData.map((e) => <CompletedRunItem completedRunData={e} /> )}
//             </div>
//         </div>
//     );
// }
//
// function CompletedRunItem({completedRunData} : {completedRunData: CompletedRunData}) {
//     return (
//         <div className={styles.completedRunItem}>
//             <div>
//                 <p>{completedRunData.kind}</p>
//                 <p>{completedRunData.dimension}D</p>
//             </div>
//             <div>
//                 <p>{new Date(Date.parse(completedRunData.timeOfRun)).toDateString()}</p>
//                 <p>{new Date(Date.parse(completedRunData.timeOfRun)).toLocaleTimeString()}</p>
//             </div>
//         </div>
//     );
// }

