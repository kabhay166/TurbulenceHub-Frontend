// src/components/PieChart.js
import {Pie} from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    Title,
} from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

// Your sample data
const Data = [
    {id: 1, year: 2016, userGain: 80000, userLost: 823},
    {id: 2, year: 2017, userGain: 45677, userLost: 345},
    {id: 3, year: 2018, userGain: 78888, userLost: 555},
    {id: 4, year: 2019, userGain: 90000, userLost: 4555},
    {id: 5, year: 2020, userGain: 4300, userLost: 234},
];

// Chart data config
const chartData = {
    type: "pie",
    labels: Data.map((d) => d.year),
    datasets: [
        {
            label: "Users Gained",
            data: Data.map((d) => d.userGain),
            backgroundColor: [
                "rgba(75,192,192,0.7)",
                "rgba(236,240,241,0.7)",
                "rgba(80,175,149,0.7)",
                "rgba(243,186,47,0.7)",
                "rgba(42,113,208,0.7)",
            ],
            borderColor: [
                "rgba(75,192,192,1)",
                "rgba(236,240,241,1)",
                "rgba(80,175,149,1)",
                "rgba(243,186,47,1)",
                "rgba(42,113,208,1)",
            ],
            borderWidth: 2,
            hoverOffset: 12,
        },
    ],
};

const chartOptions = {
    // responsive: false, // 👈 important
    maintainAspectRatio: false, // 👈 important
    aspectRatio: 1.0,
};

export default function PieChart({className}: {className: string}) {
    return (
        <div className={className}>
            <Pie data={chartData} options={chartOptions} />
        </div>
    );
}


