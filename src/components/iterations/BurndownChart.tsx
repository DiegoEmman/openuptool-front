import React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import type { BurndownData } from "../../types/iterationProgress";

interface BurndownChartProps {
    data: BurndownData;
}

export function BurndownChart({ data }: BurndownChartProps) {
    // Preparar datos para el gráfico
    const chartData = data.dataPoints.map((point) => ({
        date: new Date(point.date).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
        }),
        ideal: point.idealRemaining,
        actual: point.remainingTasks,
        completed: point.completedTasks,
    }));

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Gráfico de Burndown - {data.iterationName}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                    {new Date(data.startDate).toLocaleDateString("es-ES")} -{" "}
                    {new Date(data.endDate).toLocaleDateString("es-ES")}
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="date"
                            label={{
                                value: "Fecha",
                                position: "insideBottom",
                                offset: -5,
                            }}
                        />
                        <YAxis
                            label={{
                                value: "Tareas Restantes",
                                angle: -90,
                                position: "insideLeft",
                            }}
                        />
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="ideal"
                            stroke="#82ca9d"
                            name="Línea Ideal"
                            strokeDasharray="5 5"
                        />
                        <Line
                            type="monotone"
                            dataKey="actual"
                            stroke="#8884d8"
                            name="Tareas Restantes"
                            strokeWidth={2}
                        />
                        <Line
                            type="monotone"
                            dataKey="completed"
                            stroke="#ff7300"
                            name="Tareas Completadas"
                            strokeWidth={2}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
