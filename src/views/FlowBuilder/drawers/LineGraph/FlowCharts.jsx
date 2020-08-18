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
import {
  getLabel,
  getAxisLabel,
  getXAxisFormat,
  getTicks,
  getLineColor,
  getLegend,
} from '../../../../utils/flowMetrics';
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

  const domainRange = d3.scaleTime().domain([new Date(startDate), new Date(endDate)]);
  const ticks = getTicks(domainRange, range);

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

  const CustomizedDot = props => {
    const {
      cx, cy, value,
    } = props;

    if (value) {
      return (
        <svg
          x={cx - 5} y={cy - 5} width={10} height={10}
          viewBox="0 0 9 10">
          <path d="M512 1009.984c-274.912 0-497.76-222.848-497.76-497.76s222.848-497.76 497.76-497.76c274.912 0 497.76 222.848 497.76 497.76s-222.848 497.76-497.76 497.76zM340.768 295.936c-39.488 0-71.52 32.8-71.52 73.248s32.032 73.248 71.52 73.248c39.488 0 71.52-32.8 71.52-73.248s-32.032-73.248-71.52-73.248zM686.176 296.704c-39.488 0-71.52 32.8-71.52 73.248s32.032 73.248 71.52 73.248c39.488 0 71.52-32.8 71.52-73.248s-32.032-73.248-71.52-73.248zM772.928 555.392c-18.752-8.864-40.928-0.576-49.632 18.528-40.224 88.576-120.256 143.552-208.832 143.552-85.952 0-164.864-52.64-205.952-137.376-9.184-18.912-31.648-26.592-50.08-17.28-18.464 9.408-21.216 21.472-15.936 32.64 52.8 111.424 155.232 186.784 269.76 186.784 117.984 0 217.12-70.944 269.76-186.784 8.672-19.136 9.568-31.2-9.12-40.096z" />
        </svg>
      );
    }

    return null;
  };

  const CustomizedActiveDot = props => {
    const {
      cx, cy, value,
    } = props;

    if (value) {
      return (
        <svg
          x={cx - 5} y={cy - 5} width={10} height={10}
          viewBox="0 0 9 10">
          <path d="M3.50478 0.666495C3.7584 -0.222166 5.0178 -0.222165 5.27141 0.666496L5.54752 1.63397C5.68356 2.11067 6.17332 2.39343 6.65418 2.2729L7.63008 2.02828C8.52649 1.80358 9.15619 2.89426 8.5134 3.55822L7.81359 4.28107C7.46878 4.63724 7.46878 5.20276 7.81359 5.55893L8.5134 6.28178C9.1562 6.94574 8.52649 8.03642 7.63008 7.81172L6.65418 7.5671C6.17332 7.44657 5.68356 7.72933 5.54752 8.20603L5.27141 9.17351C5.0178 10.0622 3.7584 10.0622 3.50478 9.1735L3.22868 8.20603C3.09264 7.72933 2.60288 7.44657 2.12202 7.5671L1.14611 7.81173C0.249704 8.03642 -0.379997 6.94574 0.262799 6.28178L0.962603 5.55893C1.30742 5.20276 1.30742 4.63724 0.962603 4.28107L0.262798 3.55822C-0.379998 2.89426 0.249705 1.80358 1.14611 2.02828L2.12202 2.2729C2.60288 2.39343 3.09264 2.11067 3.22868 1.63397L3.50478 0.666495Z" />
        </svg>
      );
    }

    return null;
  };

  function CustomTooltip({ payload, label, active }) {
    if (active && Array.isArray(payload) && payload[0]?.value) {
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
            tickFormatter={unixTime => unixTime ? moment(unixTime).format(getXAxisFormat(range)) : ''}
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
              dot={<CustomizedDot />}
              activeDot={<CustomizedActiveDot />}
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
