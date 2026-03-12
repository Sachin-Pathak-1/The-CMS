import { useEffect, useMemo, useState } from "react";
import { Pie, PieChart, ResponsiveContainer } from "recharts";
import { apiRequest } from "../lib/apiClient";

const toNumericScore = (value) => {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : null;
};

export function Performance({ userId = null, isAnimationActive = true }) {
    const [grades, setGrades] = useState([]);

    useEffect(() => {
        let active = true;

        const loadGrades = async () => {
            try {
                const path = userId ? `/grade/student/${userId}` : "/grade/me";
                const response = await apiRequest(path);
                if (!active) return;
                setGrades(Array.isArray(response?.data) ? response.data : []);
            } catch {
                if (active) setGrades([]);
            }
        };

        loadGrades();
        return () => {
            active = false;
        };
    }, [userId]);

    const summary = useMemo(() => {
        const numericGrades = grades.map((item) => toNumericScore(item.grade ?? item.score)).filter((item) => item !== null);
        const average = numericGrades.length
            ? numericGrades.reduce((sum, value) => sum + value, 0) / numericGrades.length
            : 0;
        const normalized = Math.max(0, Math.min(10, average / 10));
        const score = Number(normalized.toFixed(1));

        return {
            score,
            total: numericGrades.length,
            data: [
                { name: "Achieved", value: score, fill: "#38bdf8" },
                { name: "Remaining", value: Math.max(10 - score, 0), fill: "#f8d66d" },
            ],
        };
    }, [grades]);

    return (
        <div className="glass-panel relative h-80 p-5">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold text-slate-800">Performance</h1>
                <img src="/moreDark.png" alt="" width={16} height={16} className="opacity-60" />
            </div>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        dataKey="value"
                        startAngle={180}
                        endAngle={0}
                        data={summary.data}
                        cx="50%"
                        cy="60%"
                        outerRadius="120%"
                        innerRadius={70}
                        isAnimationActive={isAnimationActive}
                    />
                </PieChart>
            </ResponsiveContainer>
            <div className="absolute left-1/2 top-1/2 text-center -translate-x-1/2 -translate-y-1/4">
                <h1 className="text-2xl font-bold text-slate-800">{summary.score}</h1>
                <p className="text-sm text-slate-400">of 10 average score</p>
            </div>
            <h2 className="absolute bottom-5 left-0 right-0 m-auto text-center font-medium text-slate-600">
                {summary.total ? `${summary.total} graded items synced` : "No graded items yet"}
            </h2>
        </div>
    );
}
