import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import React from 'react';

function AreaGraph({ data, color, onChange }) {
  const renderedLinearGradient = data.ids.Plots.map((plot, index) => (
    <linearGradient
      key={plot} id={plot} x1="0" y1="0"
      x2="0" y2="1">
      <stop offset="5%" stopColor={color[index]} stopOpacity={0.8} />
      <stop offset="95%" stopColor={color[index]} stopOpacity={0} />
    </linearGradient>
  ));

  const renderedFill = data.ids.Plots.map(plot => `url(#${plot})`);

  const renderedArea = data.ids.Plots.map((plot, index) => (
    <Area
      // eslint-disable-next-line react/no-array-index-key
      key={index}
      type="monotone"
      dataKey={plot}
      stroke={color[index]}
      fillOpacity={1}
      fill={renderedFill[index]}
      />
  ));

  return (
    <ResponsiveContainer minWidth={300} minHeight={220}>
      <AreaChart
        data={data.values}
        onClick={onChange}
        margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
      >
        <defs>{renderedLinearGradient}</defs>
        <XAxis dataKey={data.ids.XAxis} />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        {renderedArea}
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default AreaGraph;
