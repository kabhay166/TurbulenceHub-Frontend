import styles from "./UserDashboard.module.css";
import {useState} from "react";
import PieChart from "../components/PieChart.tsx";

export default function UserDashboard() {

    const [selectedSection,setSelectedSection] = useState('Runs');

    function changeSection(section:string) {
        if(section !== selectedSection) {
            setSelectedSection(section);
        }
    }
    return <div className={styles.container}>
        <div className={styles.sidebar}>

            <UserCard />
            <ul>
                <li onClick={() => changeSection('Runs')}>Runs</li>
                <li onClick={() => changeSection('A')}>B</li>
                <li>C</li>
            </ul>

        </div>

        {selectedSection === 'Runs' && <RunSection />}


    </div>
}

function Card({label, value} : {label:string, value:string}) {
    return <div className={styles.card}>
        <p>{label}</p>
        <p>{value} runs</p>
    </div>;
}

function UserCard() {
    return <div className={styles.userCard}>
        <img width={24} height={24} src="../../public/default_user_image.jpg" alt="User image"/>
        <p>Hi, Username</p>
    </div>
}


function RunSection() {
    return <div className={styles.main}>

        <div className={styles.cardContainer}>
            <Card label={'Today'} value={'4'} />
            <Card label={'This week'} value={'10'} />
            <Card label={'This month'} value={'20'} />
            <Card label={'This year'} value={'50'} />
        </div>

        <div className={styles.mainContainer}>
            <PieChart className={styles.chartContainer} />
            <RecentContainer />
        </div>

    </div>
}




const recentActivities = [
    {
        title: "Hydro",
        dimension: "3D",
        date: "22/04/2025"
    },
    {
        title: "MHD",
        dimension: "2D",
        date: "18/07/2025"
    },
    {
        title: "Euler",
        dimension: "3D",
        date: "02/06/2025"
    },
    {
        title: "Hydro",
        dimension: "3D",
        date: "22/04/2025"
    },
    {
        title: "Hydro",
        dimension: "3D",
        date: "22/04/2025"
    },
]

function RecentContainer() {
    return <div className={styles.recentContainer}>
        <p>Recent Activity</p>
        <div className={styles.recentCardContainer}>
            {
                recentActivities.map(activity => {
                    return  <RecentCard cardData={activity} />
                })
            }
        </div>

    </div>
}


type Activity = {
    title: string;
    dimension: string;
    date: string;
};

function RecentCard({ cardData }: { cardData: Activity }) {
    return (
        <div className={styles.recentCard}>
            <div>
                <p>{cardData.title}</p>
                <p>{cardData.dimension}</p>
            </div>
            <div>
                <p>{cardData.date}</p>
            </div>
        </div>
    );
}