import React, { useState, useEffect } from 'react';
import { Box, Button, ButtonGroup } from '@mui/material';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { adminAxios } from '../../../constraints/axios/adminAxios';
import adminApi from '../../../constraints/api/adminApi';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, DoughnutController, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, DoughnutController, ArcElement, Title, Tooltip, Legend);

export default function Component() {
    const [userData, setUserData] = useState([]);
    const [postData, setPostData] = useState([]);
    const [reportData, setReportData] = useState([]);
    const [viewMode, setViewMode] = useState('monthly');


    console.log(postData)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userResponse, postResponse, reportResponse] = await Promise.all([
                    adminAxios.get(adminApi.getUserData),
                    adminAxios.get(adminApi.getPostData),
                    adminAxios.get(adminApi.getReportData),
                ]);
                setUserData(userResponse.data);
                setPostData(postResponse.data);
                setReportData(reportResponse.data);
            } catch (error) {
                console.error('Error while fetching data', error);
            }
        };
        fetchData();
    }, []);

    const processData = (data, mode) => {
        return data.reduce((acc, item) => {
            const date = new Date(item.createdAt);
            const key = mode === 'yearly' ? date.getFullYear() : date.toLocaleString('default', { month: 'long' });

            if (!acc[key]) {
                acc[key] = 0;
            }
            acc[key] += 1;
            return acc;
        }, {});
    };

    const formattedUserData = processData(userData, viewMode);
    const formattedPostData = processData(postData, viewMode);
    const formattedReportData = processData(reportData, viewMode);

    const labels = Object.keys(formattedUserData).sort();
    const userDataset = labels.map(label => formattedUserData[label] || 0);

    const postLabels = Object.keys(formattedPostData).sort();
    const postDataset = postLabels.map(label => formattedPostData[label] || 0);

    const reportLabels = Object.keys(formattedReportData).sort();
    const reportDataset = reportLabels.map(label => formattedReportData[label] || 0);

    const userChartData = {
        labels,
        datasets: [
            {
                label: 'Number of Users',
                data: userDataset,
                backgroundColor: [
                   '#36FCDB',
                   '#27E784',
                   '#98E733'
                ],
                borderColor: [
                    '#36FCDB',
                    '#27E784',

                    
                ],
                borderWidth: 1,
                type: 'bar',
            },
        ],
    };


    const postChartData = {
        labels: postLabels,
        datasets: [
            {
                label: 'Number of Posts',
                data: postDataset,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
                type: 'line',
            },
        ],
    };

    const reportChartData = {
        labels: reportLabels,
        datasets: [
            {
                label: 'Number of Reports',
                data: reportDataset,
                backgroundColor: [
                    '#FC4848',
                ],
                borderColor: [

                    'rgb(255, 205, 86)',

                ],
                borderWidth: 1,
                type: 'doughnut',
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: `Data Over ${viewMode === 'yearly' ? 'Years' : 'Months'}`,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <Box flex={6} className="flex flex-col min-h-screen bg-background">
            <h1 className='text-xl font-bold shadow-sm p-7'>Dashboard</h1>
            <Box className="flex items-center justify-between bg-card px-6 py-4 shadow">
                <Box className="flex items-center gap-4">
                    <Box>
                        <p className="text-sm text-muted-foreground">Total Users</p>
                        <p className="text-2xl font-bold">{userData.length}</p>
                    </Box>
                </Box>
                <Box className="flex items-center gap-4">
                    <Box>
                        <p className="text-sm text-muted-foreground">Total Posts</p>
                        <p className="text-2xl font-bold">{postData.length}</p>
                    </Box>
                </Box>
                <Box className="flex items-center gap-4">
                    <Box>
                        <p className="text-sm text-muted-foreground">Total Reports</p>
                        <p className="text-2xl font-bold">{reportData.length}</p>
                    </Box>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: 2 }}>
                <ButtonGroup>
                    <Button size="small" variant={viewMode === 'yearly' ? 'contained' : 'outlined'} onClick={() => setViewMode('yearly')}>
                        Yearly
                    </Button>
                    <Button size="small" variant={viewMode === 'monthly' ? 'contained' : 'outlined'} onClick={() => setViewMode('monthly')}>
                        Monthly
                    </Button>
                </ButtonGroup>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', marginTop: 4 }}>
                <Box style={{ width: '600px', margin: '0 auto' }}>
                    <Bar data={userChartData} options={options} />
                </Box>
                <Box style={{ width: '600px', margin: '0 auto' }}>
                    <Line data={postChartData} options={options} />
                </Box>
                <Box style={{ width: '400px', margin: '0 auto' }}>
                    <Doughnut data={reportChartData} options={options} />
                </Box>
                {/* <Box style={{ width: '400px', margin: '0 auto' }}>
                    <Doughnut data={reportChartData} options={options} />
                </Box> */}
            </Box>
        </Box>
    );
}
