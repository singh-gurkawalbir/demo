import {
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import React from 'react';

function BarGraph({ data, color }) {
  // eslint-disable-next-line react/no-array-index-key
  const renderedBar = data.ids.Plots.map((plot, index) => <Bar key={index} dataKey={plot} stackId="a" fill={color[index]} />);

  return (
    <ResponsiveContainer minWidth={300} minHeight={220}>
      <BarChart
        width={500}
        height={400}
        data={data.values}
        // onClick={onChange}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={data.ids.XAxis} />
        <YAxis />
        <Tooltip data-testid="tooltip" />
        <Legend />
        {renderedBar}
      </BarChart>
    </ResponsiveContainer>
  );
}

export default BarGraph;
