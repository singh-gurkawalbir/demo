import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import React from 'react';

export default function LineGraph({ data, color }) {
  return (
    <ResponsiveContainer minWidth={300} minHeight={220}>
      <LineChart
        width={500} height={400} data={data.values}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid stroke="black" strokeDasharray="3 3" />
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={data.ids.XAxis} />
        <YAxis />
        <Tooltip data-testid="tooltip" />
        <Legend />
        <Line
          type="linear" dataKey={data.ids.Plots[0]} stroke={color || '#8884d8'} strokeWidth={6}
          activeDot={{ r: 8 }} data-testid="line" />
      </LineChart>
    </ResponsiveContainer>
  );
}
