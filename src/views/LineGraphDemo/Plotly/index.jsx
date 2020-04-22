import Plot from 'react-plotly.js';
import { makeStyles } from '@material-ui/core';
import PanelHeader from '../../../components/PanelHeader';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
}));
const getRandomData = count => {
  const x = [];
  const y = [];

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < count; i++) {
    x.push(i + 1);
    y.push(Math.floor(Math.random() * 1000));
  }

  return { x, y };
};

export default function PlotlyDemo() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <PanelHeader title="Plotly Demo" />
      <Plot
        data={[
          {
            y: getRandomData(1000).y,
            x: getRandomData(1000).x,
            type: 'line',
            name: 'success',
            mode: 'lines+markers',
            marker: { color: 'green' },
          },
          {
            y: getRandomData(1000).y,
            x: getRandomData(1000).x,
            type: 'line',
            line: {
              shape: 'spline',
            },
            name: 'errors',
            mode: 'lines+markers',
            marker: { color: 'red' },
          },
        ]}
        layout={{
          width: 730,
          height: 650,
          title: 'Flow Status',
          showlegend: false,
        }}
        config={{
          responsive: true,
          displaylogo: false,
          modeBarButtonsToRemove: ['toImage'],
        }}
      />
    </div>
  );
}
