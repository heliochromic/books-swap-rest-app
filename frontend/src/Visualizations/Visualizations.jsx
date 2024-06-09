import React, {useEffect, useState} from "react";
import axios from "axios";
import {
    Chart as ChartJS,
    ArcElement,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from "chart.js";
import {Pie, Bar} from "react-chartjs-2";
import {getConfig} from "../utils";
import "./Visualizations.css";
import {useNavigate} from "react-router-dom";

// Register the required components
ChartJS.register(
    ArcElement,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
);

const Visualizations = () => {
    const [chartData1, setChartData1] = useState({});
    const [chartData2, setChartData2] = useState({});
    const [barData, setBarData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8000/api/visualizations/`,
                    getConfig()
                );
                const data = response.data;

                const statuses1 = data.chart1.map((item) => item.status);
                const counts1 = data.chart1.map((item) => item.count);

                setChartData1({
                    labels: statuses1,
                    datasets: [
                        {
                            data: counts1,
                            backgroundColor: [
                                "#FF6384",
                                "#36A2EB",
                                "#FFCE56",
                                "#FF6384",
                                "#36A2EB",
                            ],
                            hoverBackgroundColor: [
                                "#FF6384",
                                "#36A2EB",
                                "#FFCE56",
                                "#FF6384",
                                "#36A2EB",
                            ],
                        },
                    ],
                });

                const statuses2 = data.chart2.map((item) => item.language);
                const counts2 = data.chart2.map((item) => item.count);

                setChartData2({
                    labels: statuses2,
                    datasets: [
                        {
                            data: counts2,
                            backgroundColor: [
                                "#FF6384",
                                "#36A2EB",
                                "#FFCE56",
                                "#FF6384",
                                "#36A2EB",
                                "#FFA07A",
                                "#20B2AA",
                                "#9370DB",
                                "#32CD32",
                                "#FFD700",
                            ],
                            hoverBackgroundColor: [
                                "#FF6384",
                                "#36A2EB",
                                "#FFCE56",
                                "#FF6384",
                                "#36A2EB",
                                "#FFA07A",
                                "#20B2AA",
                                "#9370DB",
                                "#32CD32",
                                "#FFD700",
                            ],
                        },
                    ],
                });

                const barLabels = data.barChart.map((item) => item.userID);
                const barValues = data.barChart.map((item) => item.count);

                setBarData({
                    labels: barLabels,
                    datasets: [
                        {
                            label: "Amount of published books",
                            data: barValues,
                            backgroundColor: "#36A2EB",
                            hoverBackgroundColor: "#36A2EB",
                        },
                    ],
                });

                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching data: ", error);
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleClick = (chartElements) => {
        if (chartElements.length > 0) {
            const clickedIndex = chartElements[0].index;
            const clickedUserID = barData.labels[clickedIndex];
            console.log("Clicked UserID:", clickedUserID);
            navigate(`/user/${clickedUserID}`);
        }
    };

    return (
        <div className="container charts">
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <div className="row ">
                        <div className="col-md-6 col-sm-12 chart-container">
                            <h2>Request Statuses</h2>
                            <Pie data={chartData1}/>
                        </div>
                        <div className="col-md-6 col-sm-12 chart-container">
                            <h2>Languages Distribution</h2>
                            <Pie data={chartData2}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 chart-container">
                            <h2>Top Active Users</h2>
                            <Bar
                                data={barData}
                                options={{
                                    onClick: (event, chartElements) => handleClick(chartElements),
                                }}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Visualizations;
