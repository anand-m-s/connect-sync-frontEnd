import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { Box, Stack } from '@mui/material';
import { BarPlot } from '@mui/x-charts/BarChart';
import { LinePlot } from '@mui/x-charts/LineChart';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';

const series = [
    {
        type: 'bar',
        stack: '',
        yAxisKey: 'eco',
        data: [2, 5, 3, 4, 1],
    },
    {
        type: 'bar',
        stack: '',
        yAxisKey: 'eco',
        data: [5, 6, 2, 8, 9],
    },
    {
        type: 'line',
        yAxisKey: 'pib',
        color: 'red',
        data: [1000, 1500, 3000, 5000, 10000],
    },
];

export default function BasicBars() {
    return (
        <Box flex={6}>
            <Box className=''>
                <h1 className='flex  p-6  justify-center bg-black text-white '>Dashboard</h1>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                <Stack direction="row" spacing={2} className='mt-10'>
                    <BarChart
                        xAxis={[{ scaleType: 'band', data: ['group A', 'group B', 'group C'] }]}
                        series={[{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }]}
                        width={500}
                        height={300}
                    />
                    <PieChart
                        series={[
                            {
                                data: [
                                    { id: 0, value: 10, label: 'series A' },
                                    { id: 1, value: 15, label: 'series B' },
                                    { id: 2, value: 20, label: 'series C' },
                                ],
                            },
                        ]}
                        width={400}
                        height={200}
                    />
                </Stack>
                <ChartContainer
                    series={series}
                    width={500}
                    height={400}
                    xAxis={[
                        {
                            id: 'years',
                            data: [2010, 2011, 2012, 2013, 2014],
                            scaleType: 'band',
                            valueFormatter: (value) => value.toString(),
                        },
                    ]}
                    yAxis={[
                        {
                            id: 'eco',
                            scaleType: 'linear',
                        },
                        {
                            id: 'pib',
                            scaleType: 'log',
                        },
                    ]}
                >
                    <BarPlot />
                    <LinePlot />
                    <ChartsXAxis label="Years" position="bottom" axisId="years" />
                    <ChartsYAxis label="Results" position="left" axisId="eco" />
                    <ChartsYAxis label="PIB" position="right" axisId="pib" />
                </ChartContainer>
            </Box>
        </Box>
    );
}
