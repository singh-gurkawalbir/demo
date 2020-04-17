import Plot from 'react-plotly.js';
import { makeStyles } from '@material-ui/core';
import PanelHeader from '../../../components/PanelHeader';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
}));

export default function PlotlyDemo() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <PanelHeader title="Plotly Demo" />
      <Plot
        data={[
          {
            y: [100, 2000, 1500, 800, 900, 750, 1456],
            x: [1, 2, 3, 4, 5, 6, 7],
            type: 'line',
            name: 'success',
            mode: 'lines+markers',
            marker: { color: 'green' },
          },
          {
            y: [10, 200, 500, 900, 600, 1750, 1456],
            x: [1, 2, 3, 4, 5, 6, 7],
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
