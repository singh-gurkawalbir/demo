import React, { useEffect } from 'react';
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
import * as d3 from 'd3';
import { sortBy } from 'lodash';
import { makeStyles, Typography } from '@material-ui/core';
import PanelHeader from '../../../../components/PanelHeader';
import { getLabel, getAxisLabel } from '../../../../utils/flowMetrics';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import Spinner from '../../../../components/Spinner';
import SpinnerWrapper from '../../../../components/SpinnerWrapper';

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

const Chart = ({ id, flowId, range, selectedResources }) => {
  const { data = [] } =
    useSelector(state => selectors.flowMetricsData(state, flowId, id)) || {};
  const flowResources = useSelector(state =>
    selectors.flowResources(state, flowId)
  );
  const { startDate, endDate } = range;

  let dateTimeFormat;
  const userOwnPreferences = useSelector(
    state => selectors.userOwnPreferences(state),
    (left, right) =>
      left &&
      right &&
      left.dateFormat === right.dateFormat &&
      left.timeFormat === right.timeFormat
  );

  if (!userOwnPreferences) {
    dateTimeFormat = 'MM/DD hh:mm';
  } else {
    dateTimeFormat = `${userOwnPreferences.dateFormat || 'MM/DD'} ${userOwnPreferences.timeFormat || 'hh:mm'} `;
  }

  const days = moment(endDate).diff(moment(startDate), 'days');

  const domainRange = d3.scaleTime().domain([new Date(startDate), new Date(endDate)]);
  let ticks;

  if (days < 7) {
    ticks = domainRange.ticks(d3.timeHour.every(1)).map(t => t.getTime());
  } else if (days < 180) {
    ticks = domainRange.ticks(d3.timeHour.every(24)).map(t => t.getTime());
  } else {
    ticks = domainRange.ticks(d3.timeHour.every(24 * 30)).map(t => t.getTime());
  }

  // Add Zero data for ticks
  ticks.forEach(tick => {
    if (!data.find(d => d.timeInMills === tick)) {
      selectedResources.forEach(r => {
        data.push({timeInMills: tick, time: new Date(tick).toISOString(), [`${r}-value`]: 0});
      });
    }
  });

  const flowData = sortBy(data, ['timeInMills']);

  const getResourceName = name => {
    const resourceId = name.replace(/-value/, '');
    let modifiedName = resourceId;
    const resource = flowResources.find(r => r._id === resourceId);

    if (resource) {
      modifiedName = resource.name;
    }

    return modifiedName;
  };

  function CustomTooltip({ payload, label, active }) {
    if (active) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`${moment(label).format(dateTimeFormat)}`} </p>
          <p> {payload[0]?.value} </p>
        </div>
      );
    }

    return null;
  }
  const renderColorfulLegendText = (value, { color }) => <span style={{ color }}>{getResourceName(value)}</span>;

  return (
    <>
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
            dataKey="timeInMills"
            domain={domainRange}
            scale="time"
            type="number"
            ticks={ticks}
            // tickFormatter={timeFormatter}
            // name="Time"
            // type="category"
            tickFormatter={unixTime => unixTime ? moment(unixTime).format('MM/DD hh:mm') : ''}
          />
          <YAxis
            yAxisId={id}
            type="number"
            label={{
              value: getAxisLabel(id),
              angle: -90,
              position: 'insideLeft',
              textAnchor: 'middle',
            }}
            domain={[() => 0, dataMax => dataMax + 10]}
          />

          <Tooltip content={<CustomTooltip />} />
          <Legend formatter={renderColorfulLegendText} />
          {selectedResources.map((r, i) => (
            <Line
              key={r}
              dataKey={`${r}-value`}
              yAxisId={id}
              strokeWidth="2"
              legendType={getLegend(i)}
              stroke={getLineColor(i)}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </>
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
      <SpinnerWrapper>
        <Spinner />
      </SpinnerWrapper>
    );
  }
  if (data.status === 'error') {
    return <Typography>Error Occured</Typography>;
  }

  return (
    <div className={classes.root}>
      {['success', 'error', 'ignored', 'averageTimeTaken'].map(m => (
        <Chart
          key={m}
          id={m}
          range={range}
          flowId={flowId}
          selectedResources={selectedResources}
        />
      ))}
    </div>
  );
}
