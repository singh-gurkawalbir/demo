import React, { useEffect, Fragment } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import moment from 'moment';
import {
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  ResponsiveContainer,
} from 'recharts';
// import { differenceInHours, fromUnixTime } from 'date-fns';
import { makeStyles, Typography } from '@material-ui/core';
import PanelHeader from '../../../../components/PanelHeader';
import * as selectors from '../../../../reducers';
import { getLabel } from '../../../../utils/flowMetrics';
import actions from '../../../../actions';
import Loader from '../../../../components/Loader';
import Spinner from '../../../../components/Spinner';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
    background: theme.palette.background.default,
  },
}));
const getLineColor = index => {
  const colorSpectrum = [
    '#2B5B36',
    '#24448E',
    '#3A6CA1',
    '#549FC3',
    '#8FC4C6',
    '#AFCF8B',
    '#80B875',
    '#57A05C',
  ];

  return colorSpectrum[index % 8];
};

const getLegend = index => {
  const legendTypes = [
    'line',
    'square',
    'circle',
    'cross',
    'diamond',
    'star',
    'triangle',
    'wye',
    'rect',
    'plainline',
  ];

  return legendTypes[index % 10];
};

const Chart = ({ id, flowId, selectedResources }) => {
  const { data: flowData } =
    useSelector(state => selectors.flowMetricsData(state, flowId, id)) || {};
  const flowResources = useSelector(state =>
    selectors.flowResources(state, flowId)
  );
  const getResourceName = name => {
    const resourceId = name.replace(/-value/, '');
    let modifiedName = resourceId;
    const resource = flowResources.find(r => r._id === resourceId);

    if (resource) {
      modifiedName = resource.name;
    }

    return modifiedName;
  };

  const parseValue = (value, name) => [value, getResourceName(name)];
  const renderColorfulLegendText = (value, entry) => {
    const { color } = entry;

    return <span style={{ color }}>{getResourceName(value)}</span>;
  };

  return (
    <Fragment>
      <PanelHeader title={getLabel(id)} />
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={flowData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}>
          <XAxis
            dataKey="time"
            name="Time"
            type="category"
            tickFormatter={unixTime =>
              moment(unixTime).format('DD/MMM HH:mm  ')
            }
          />
          <YAxis
            yAxisId={id}
            type="number"
            label={{
              value: '# of transmissions',
              angle: -90,
              position: 'insideLeft',
              textAnchor: 'middle',
            }}
            domain={[() => 0, dataMax => dataMax + 10]}
          />

          <Tooltip formatter={(value, name) => parseValue(value, name)} />
          <Legend formatter={renderColorfulLegendText} />
          {selectedResources.map((r, i) => (
            <Line
              key={r}
              dataKey={`${r}-value`}
              yAxisId={id}
              legendType={getLegend(i)}
              stroke={getLineColor(i)}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Fragment>
  );
};

export default function FlowCharts({ flowId, range, selectedResources }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const data =
    useSelector(
      state => selectors.flowMetricsData(state, flowId),
      shallowEqual
    ) || {};

  useEffect(() => {
    if (!data.data && !data.status) {
      dispatch(actions.flowMetrics.request(flowId, { range }));
    }
  }, [data, dispatch, flowId, range]);

  if (data.status === 'requested') {
    return (
      <Loader open>
        Fetching data
        <Spinner />
      </Loader>
    );
  } else if (data.status === 'error') {
    return <Typography>Error Occured</Typography>;
  }

  return (
    <div className={classes.root}>
      {['success', 'error', 'ignored', 'averageTimeTaken'].map(m => (
        <Chart
          key={m}
          id={m}
          flowId={flowId}
          selectedResources={selectedResources}
        />
      ))}
    </div>
  );
}
