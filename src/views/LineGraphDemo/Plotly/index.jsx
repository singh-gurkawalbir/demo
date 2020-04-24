import Plot from 'react-plotly.js';
import moment from 'moment';
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
    x.push(
      moment()
        .add(-i, 'm')
        .toISOString()
    );
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
            y: getRandomData(50).y,
            x: getRandomData(50).x,
            type: 'line',
            name: 'success',
            mode: 'lines+markers',
            hoverinfo: 'all',
            marker: { color: 'green', symbol: 'cirlce-dot' },
          },
          {
            y: getRandomData(50).y,
            x: getRandomData(50).x,
            type: 'line',
            line: {
              shape: 'spline',
            },
            name: 'errors',
            mode: 'lines+markers',
            marker: { color: 'red', symbol: 'square-open-dot' },
          },
        ]}
        layout={{
          title: 'Flow Status',
          showlegend: false,
          xaxis: {
            type: 'date',
          },
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
