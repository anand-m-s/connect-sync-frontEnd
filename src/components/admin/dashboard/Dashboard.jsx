// import React, { useState, useEffect } from 'react';
// import { Box, Button, ButtonGroup, Stack } from '@mui/material';
// import { Bar,Line } from 'react-chartjs-2';
// import { adminAxios } from '../../../constraints/axios/adminAxios';
// import adminApi from '../../../constraints/api/adminApi';
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// export default function Component() {
//     const [userData, setUserData] = useState([]);
//     const [postData, setPostData] = useState([]);
//     const [reportData, setReportData] = useState([]);
//     const [viewMode, setViewMode] = useState('monthly');
//     console.log(postData)
//     console.log(userData)
//     console.log(reportData)
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const [userResponse, postResponse, reportResponse] = await Promise.all([
//                     adminAxios.get(adminApi.getUserData),
//                     adminAxios.get(adminApi.getPostData),
//                     adminAxios.get(adminApi.getReportData),
//                 ]);
//                 setUserData(userResponse.data);
//                 setPostData(postResponse.data)
//                 setReportData(reportResponse.data)
//             } catch (error) {
//                 console.error('Error while fetching data', error);
//             }
//         };
//         fetchData();
//     }, []);

//     const processData = (data, mode) => {
//         return data.reduce((acc, item) => {
//             const date = new Date(item.createdAt);
//             const key = mode === 'yearly' ? date.getFullYear() : date.toLocaleString('default', { month: 'long' });

//             if (!acc[key]) {
//                 acc[key] = 0;
//             }
//             acc[key] += 1;
//             return acc;
//         }, {});
//     };


//     const formattedData = processData(userData, viewMode);
//     const labels = Object.keys(formattedData);
//     const data = labels.map(label => formattedData[label]);



//     const processedPostData = processData(postData, viewMode)
//     const postLabels = Object.keys(processedPostData);
//     const postCounts = postLabels.map(label => processedPostData[label]);
//     console.log(postCounts)


//     const processedReportData = processData(reportData, viewMode)
//     const reportLabels = Object.keys(processedReportData);
//     const reportCount = reportLabels.map(label => processedReportData[label]);

//     const chartData = {
//         labels,
//         datasets: [
//             {
//                 label: 'Number of Users',
//                 data,
//                 backgroundColor: [
//                     'rgba(255, 99, 132, 0.2)',
//                     'rgba(255, 159, 64, 0.2)',
//                     'rgba(255, 205, 86, 0.2)',
//                     'rgba(75, 192, 192, 0.2)',
//                     'rgba(54, 162, 235, 0.2)',
//                     'rgba(153, 102, 255, 0.2)',
//                     'rgba(201, 203, 207, 0.2)'
//                 ],
//                 borderColor: [
//                     'rgb(255, 99, 132)',
//                     'rgb(255, 159, 64)',
//                     'rgb(255, 205, 86)',
//                     'rgb(75, 192, 192)',
//                     'rgb(54, 162, 235)',
//                     'rgb(153, 102, 255)',
//                     'rgb(201, 203, 207)'
//                 ],
//                 borderWidth: 1
//             },
//         ],
//     };

//     const options = {
//         responsive: true,
//         plugins: {
//             legend: {
//                 position: 'top',
//             },
//             title: {
//                 display: true,
//                 text: `User Creation Over ${viewMode === 'yearly' ? 'Years' : 'Months'}`,
//             },
//         },
//         scales: {
//             y: {
//                 beginAtZero: true,
//             },
//         },
//     };

//     const postChartData = {
//         labels: postLabels,
//         datasets: [
//             {
//                 label: 'Number of Posts',
//                 data: postCounts,
//                 backgroundColor: [
//                     'rgba(255, 99, 132, 0.2)', // Red
//                     'rgba(255, 159, 64, 0.2)', // Orange
//                     'rgba(255, 205, 86, 0.2)', // Yellow
//                     'rgba(75, 192, 192, 0.2)', // Light Blue
//                     'rgba(54, 162, 235, 0.2)', // Blue
//                     'rgba(153, 102, 255, 0.2)', // Purple
//                     'rgba(201, 203, 207, 0.2)' // Gray
//                 ],
//                 borderColor: [
//                     'rgb(255, 99, 132)', // Red
//                     'rgb(255, 159, 64)', // Orange
//                     'rgb(255, 205, 86)', // Yellow
//                     'rgb(75, 192, 192)', // Light Blue
//                     'rgb(54, 162, 235)', // Blue
//                     'rgb(153, 102, 255)', // Purple
//                     'rgb(201, 203, 207)' // Gray
//                 ],
//                 borderWidth: 1
//             },
//         ],
//     };
    
    
//     const postOptions = {
//         responsive: true,
//         plugins: {
//             legend: {
//                 position: 'top',
//             },
//             title: {
//                 display: true,
//                 text: `Post Count Over ${viewMode === 'yearly' ? 'Years' : 'Months'}`,
//             },
//         },
//         scales: {
//             y: {
//                 beginAtZero: true,
//             },
//         },
//     };
    

//     return (
//         <Box flex={6} className="flex flex-col min-h-screen bg-background">
//             <Box className="flex items-center justify-between bg-card px-6 py-4 shadow">
//                 <Box className="flex items-center gap-4">
//                     <Box>
//                         <p className="text-sm text-muted-foreground">Total Users</p>
//                         <p className="text-2xl font-bold">{userData.length}</p>
//                     </Box>
//                 </Box>
//                 <Box className="flex items-center gap-4">
//                     <Box>
//                         <p className="text-sm text-muted-foreground">Total Posts</p>
//                         <p className="text-2xl font-bold">{postData.length}</p>
//                     </Box>
//                 </Box>
//                 <Box className="flex items-center gap-4">
//                     <Box>
//                         <p className="text-sm text-muted-foreground">Total Reports</p>
//                         <p className="text-2xl font-bold">{reportData.length}</p>
//                     </Box>
//                 </Box>
//             </Box>

//             <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: 2 }}>
//                 <ButtonGroup>
//                     <Button size="small" variant={viewMode === 'yearly' ? 'contained' : 'outlined'} onClick={() => setViewMode('yearly')}>
//                         Yearly
//                     </Button>
//                     <Button size="small" variant={viewMode === 'monthly' ? 'contained' : 'outlined'} onClick={() => setViewMode('monthly')}>
//                         Monthly
//                     </Button>
//                 </ButtonGroup>
//             </Box>

//             <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: 4 }}>
                
//                     <Box style={{ width: '600px', margin: '0 auto' }}>
//                         <Bar data={chartData} options={options} />
//                     </Box>
//                     <Box style={{ width: '600px', margin: '0 auto' }}>
//                         <Bar data={postChartData} options={postOptions} />
//                     </Box>
                
//             </Box>
//         </Box>
//     );
// }

// import React, { useState, useEffect } from 'react';
// import { Box, Button, ButtonGroup, Stack } from '@mui/material';
// import { Bar, Line, Doughnut } from 'react-chartjs-2';
// import { adminAxios } from '../../../constraints/axios/adminAxios';
// import adminApi from '../../../constraints/api/adminApi';
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, DoughnutController, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, DoughnutController, ArcElement, Title, Tooltip, Legend);

// export default function Component() {
//     const [userData, setUserData] = useState([]);
//     const [postData, setPostData] = useState([]);
//     const [reportData, setReportData] = useState([]);
//     const [viewMode, setViewMode] = useState('monthly');

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const [userResponse, postResponse, reportResponse] = await Promise.all([
//                     adminAxios.get(adminApi.getUserData),
//                     adminAxios.get(adminApi.getPostData),
//                     adminAxios.get(adminApi.getReportData),
//                 ]);
//                 setUserData(userResponse.data);
//                 setPostData(postResponse.data);
//                 setReportData(reportResponse.data);
//             } catch (error) {
//                 console.error('Error while fetching data', error);
//             }
//         };
//         fetchData();
//     }, []);

//     const processData = (data, mode) => {
//         return data.reduce((acc, item) => {
//             const date = new Date(item.createdAt);
//             const key = mode === 'yearly' ? date.getFullYear() : date.toLocaleString('default', { month: 'long' });

//             if (!acc[key]) {
//                 acc[key] = 0;
//             }
//             acc[key] += 1;
//             return acc;
//         }, {});
//     };

//     const formattedUserData = processData(userData, viewMode);
//     const formattedPostData = processData(postData, viewMode);
//     const formattedReportData = processData(reportData, viewMode);

//     const labels = Object.keys(formattedUserData).sort();
//     const userDataset = labels.map(label => formattedUserData[label] || 0);
//     const postDataset = labels.map(label => formattedPostData[label] || 0);
//     const reportDataset = labels.map(label => formattedReportData[label] || 0);

//     const userChartData = {
//         labels,
//         datasets: [
//             {
//                 label: 'Number of Users',
//                 data: userDataset,
//                 backgroundColor: 'rgba(75, 192, 192, 0.2)',
//                 borderColor: 'rgba(75, 192, 192, 1)',
//                 borderWidth: 1,
//                 type: 'bar',
//             },
//         ],
//     };

//     const postChartData = {
//         labels,
//         datasets: [
//             {
//                 label: 'Number of Posts',
//                 data: postDataset,
//                 fill: false,
//                 borderColor: 'rgb(75, 192, 192)',
//                 tension: 0.1,
//                 type: 'line',
//             },
//         ],
//     };

//     const reportChartData = {
//         labels,
//         datasets: [
//             {
//                 label: 'Number of Reports',
//                 data: reportDataset,
//                 backgroundColor: [
//                     'rgba(255, 99, 132, 0.2)', 
//                     'rgba(255, 159, 64, 0.2)', 
//                     'rgba(255, 205, 86, 0.2)', 
//                     'rgba(75, 192, 192, 0.2)', 
//                     'rgba(54, 162, 235, 0.2)', 
//                     'rgba(153, 102, 255, 0.2)', 
//                     'rgba(201, 203, 207, 0.2)'
//                 ],
//                 borderColor: [
//                     'rgb(255, 99, 132)', 
//                     'rgb(255, 159, 64)', 
//                     'rgb(255, 205, 86)', 
//                     'rgb(75, 192, 192)', 
//                     'rgb(54, 162, 235)', 
//                     'rgb(153, 102, 255)', 
//                     'rgb(201, 203, 207)'
//                 ],
//                 borderWidth: 1,
//                 type: 'doughnut',
//             },
//         ],
//     };

//     const options = {
//         responsive: true,
//         plugins: {
//             legend: {
//                 position: 'top',
//             },
//             title: {
//                 display: true,
//                 text: `Data Over ${viewMode === 'yearly' ? 'Years' : 'Months'}`,
//             },
//         },
//         scales: {
//             y: {
//                 beginAtZero: true,
//             },
//         },
//     };

//     return (
//         <Box flex={6} className="flex flex-col min-h-screen bg-background">
//             <Box className="flex items-center justify-between bg-card px-6 py-4 shadow">
//                 <Box className="flex items-center gap-4">
//                     <Box>
//                         <p className="text-sm text-muted-foreground">Total Users</p>
//                         <p className="text-2xl font-bold">{userData.length}</p>
//                     </Box>
//                 </Box>
//                 <Box className="flex items-center gap-4">
//                     <Box>
//                         <p className="text-sm text-muted-foreground">Total Posts</p>
//                         <p className="text-2xl font-bold">{postData.length}</p>
//                     </Box>
//                 </Box>
//                 <Box className="flex items-center gap-4">
//                     <Box>
//                         <p className="text-sm text-muted-foreground">Total Reports</p>
//                         <p className="text-2xl font-bold">{reportData.length}</p>
//                     </Box>
//                 </Box>
//             </Box>

//             <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: 2 }}>
//                 <ButtonGroup>
//                     <Button size="small" variant={viewMode === 'yearly' ? 'contained' : 'outlined'} onClick={() => setViewMode('yearly')}>
//                         Yearly
//                     </Button>
//                     <Button size="small" variant={viewMode === 'monthly' ? 'contained' : 'outlined'} onClick={() => setViewMode('monthly')}>
//                         Monthly
//                     </Button>
//                 </ButtonGroup>
//             </Box>

//             <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: 4 }}>
//                 <Box style={{ width: '600px', margin: '0 auto' }}>
//                     <Bar data={userChartData} options={options} />
//                 </Box>
//                 <Box style={{ width: '600px', margin: '0 auto' }}>
//                     <Line data={postChartData} options={options} />
//                 </Box>
//                 <Box style={{ width: '600px', margin: '0 auto' }}>
//                     <Doughnut data={reportChartData} options={options} />
//                 </Box>
//             </Box>
//         </Box>
//     );
// }


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
                backgroundColor: 'rgba(1, 200, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
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
                    'rgba(255, 99, 132, 0.2)', // Red
                    'rgba(255, 159, 64, 0.2)', // Orange
                    'rgba(255, 205, 86, 0.2)', // Yellow
                    'rgba(75, 192, 192, 0.2)', // Light Blue
                    'rgba(54, 162, 235, 0.2)', // Blue
                    'rgba(153, 102, 255, 0.2)', // Purple
                    'rgba(201, 203, 207, 0.2)' // Gray
                ],
                borderColor: [
                    'rgb(255, 99, 132)', // Red
                    'rgb(255, 159, 64)', // Orange
                    'rgb(255, 205, 86)', // Yellow
                    'rgb(75, 192, 192)', // Light Blue
                    'rgb(54, 162, 235)', // Blue
                    'rgb(153, 102, 255)', // Purple
                    'rgb(201, 203, 207)' // Gray
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

            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: 4 }}>
                <Box style={{ width: '600px', margin: '0 auto' }}>
                    <Bar data={userChartData} options={options} />
                </Box>
                <Box style={{ width: '600px', margin: '0 auto' }}>
                    <Line data={postChartData} options={options} />
                </Box>
                <Box style={{ width: '600px', margin: '0 auto' }}>
                    <Doughnut data={reportChartData} options={options} />
                </Box>
            </Box>
        </Box>
    );
}
