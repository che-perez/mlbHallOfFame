import { type JSX } from "react";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ReferenceLine, ResponsiveContainer, Cell, LabelList, Tooltip } from "recharts";

interface Player {
  id: number;
  name: string;
  yearsOnBallot: number;
  voters: string[];
}

interface VotingChartProps {
    players: Player[];
    totalVotes: number;
}

interface BarChartData {
    name: string;
    votes: number;
    percentage: number;
}

interface Payload {
  payload: BarChartData;
}

interface CustomTooltipProps {
    active: boolean;
    payload?: Payload[];
    label?: string;
}

const ELECTION_THRESHOLD = 75;

const getBarColor = (percentage: number): string => {
    if(percentage >= ELECTION_THRESHOLD) return "#059669";
    if(percentage >= 60) return "#0EA5E9";
    if(percentage >= 40) return "#6366F1";
    if(percentage >= 20) return "#8B5CF6";
    return "#A1A1AA";
};

const CustomTooltip = ({ active, payload, label}: CustomTooltipProps) => {
    if(!active || !payload?.[0]) return null;
    
    const data = payload[0].payload;
    return (
        <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3">
            <p className="font-semibold text-slate-900">{label === 'Chase Utley' ? `F**K ${label}` : data.name}</p>
            <p className="text-sm text-slate-600">{data.percentage.toFixed(1)}% ({data.votes} votes)</p>
        </div>
    );
};

export default function VotingChart({ players, totalVotes }: VotingChartProps): JSX.Element {
    const playerData: BarChartData[] = players.map(p => {
        return {
            name: p.name,
            votes: p.voters.length,
            percentage: (p.voters.length / totalVotes) * 100
        }
    })
    return (
        <div className="h-[500px]" role="img" aria-label={`Bar Chart showing ${players.length} Hall of Fame candidates and their vote percentages.`}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={playerData} margin={{ top: 20, right: 20, left: 10, bottom: 120 }} aria-label="Hall of Fame voting percentages">
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#4B5563", textAnchor: "end" }} angle={-45} interval={0} axisLine={{ stroke: "#E5E7EB"}} tickLine={false} height={120} />
                    <YAxis domain={[ 0, 100 ]} tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} tickFormatter={(value) => `${value}%`} width={45} />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={ELECTION_THRESHOLD} stroke="#DC2626" strokeDasharray="8 4" strokeWidth={2} label={{ value: "75% Threshold", position: "right", fill: "#DC2626", fontSize: 11, fontWeight: 500 }} />
                    <Bar dataKey="percentage" radius={[4, 4, 0, 0]} maxBarSize={50}>
                        {players.map(player => { 
                            const barColor = getBarColor((player.voters.length / totalVotes) * 100);

                            return (
                                <Cell key={`cell-${player.id}`} fill={barColor}/>
                            )
                        })}
                        <LabelList dataKey="percentage" position="top" formatter={(value) => `${value.toFixed(1)}%`} fontSize={10} fill="#374151"/>
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

