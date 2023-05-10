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
import './Bar.css';
import React from 'react';

function BarGraph({ data, onChange }) {
  // const CustomTooltip = ({ active, payload, label }) => {
  //     if (active && payload && payload.length) {
  //       return (
  //         <div className="custom-tooltip">
  //           <p className="label">{`${label}`}</p>
  //           <hr />
  //           <p>{`${payload[0].value}/150`}</p>
  //           <p>{`${payload[1].value}/150`}</p>
  //           <p>{"A and B represent the marks obtained"}</p>
  //         </div>
  //       );
  //     }

  //     return null;
  //   };

  // eslint-disable-next-line react/no-array-index-key
  const color = ['#D93535', '#05B39C'];
  // eslint-disable-next-line react/no-array-index-key
  const renderedBar = data.ids.Plots.map((plot, index) => <Bar key={index} dataKey={plot} stackId="a" fill={color[index]} />);

  return (
    <ResponsiveContainer minWidth={300} minHeight={220}>
      <BarChart
        width={500}
        height={400}
        data={data.values}
        onClick={onChange}
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
