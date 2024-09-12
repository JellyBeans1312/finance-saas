import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip
} from 'recharts';
import { CategoryTooltip } from './CategoryTooltip';

type Props = { 
    data: {
        name: string;
        value: number;
    }[]
};

export const RadarVariant = ({ data }: Props) => {
    return (
        <ResponsiveContainer width={"100%"} height={350}>
            <RadarChart
                cx={"50%"}
                cy={"50%"}
                outerRadius={"60%"}
                data={data}
            >
                <Tooltip content={CategoryTooltip}/>
                <PolarGrid />
                <PolarAngleAxis style={{ fontStyle: "12px" }} dataKey={"name"} />
                <PolarRadiusAxis style={{ fontStyle: "12px" }} />
                <Radar dataKey={"value"} stroke='#3b82f6' fill='#3b82f6' fillOpacity={0.6} />
            </RadarChart>
        </ResponsiveContainer>
    );
};
