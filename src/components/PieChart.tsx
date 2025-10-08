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

const chartOptions = {
    // responsive: false, // 👈 important
    maintainAspectRatio: false, // 👈 important
    aspectRatio: 1.0,
};


interface ChartItem {
    label: string,
    value: number
}

type ChartData = ChartItem[];

export default function PieChart({className,data}: {className: string,data: ChartData}) {

    const chartData = {
        type: "pie",
        labels: data.map((d) => d.label),
        datasets: [
            {
                label: "No. of Runs",
                data: data.map((d) => d.value),
                backgroundColor: [
                    "rgba(75,192,192,0.7)",
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
    return (
        <div className={className}>
            <Pie data={chartData} options={chartOptions} />
        </div>
    );
}


