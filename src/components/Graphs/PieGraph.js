import React, { useCallback, useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Sector } from 'recharts';

const initialRadius = 45;
const width = 45;
const margin = 27;

const renderActiveShape = props => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  // const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  // const ey = my;

  return (
    <g>
      <text
        x={cx} y={cy} dy={8} textAnchor="middle"
        fill={fill}>
        {payload.subject}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 4}
        outerRadius={outerRadius + 6}
        fill={fill}
      />
      <text
        x={mx + (cos >= 0 ? 1 : -1) * 12}
        y={my}
        fill="#333"
      >{`PV ${value}`}
      </text>
    </g>
  );
};

function PieGraph({ data, color }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const onPieEnter = useCallback(
    (_, index) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );

  console.log('');

  const renderedPie = data.ids.Plots.map((plot, index) => {
    const fn =
      index + 1 === data.ids.Plots.length ? renderActiveShape : null;

    return (
      <Pie
        // eslint-disable-next-line react/no-array-index-key
        key={index}
        activeIndex={activeIndex}
        activeShape={fn}
        data={data.values}
        innerRadius={initialRadius + index * margin}
        outerRadius={initialRadius + index * margin + width}
        fill={color[index]}
        dataKey={plot}
        onMouseEnter={onPieEnter}
      />
    );
  });

  return (
    <ResponsiveContainer minWidth={300} minHeight={180}>
      <PieChart>{renderedPie}</PieChart>
    </ResponsiveContainer>
  );
}

export default PieGraph;
