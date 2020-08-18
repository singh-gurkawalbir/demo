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
  const flowData = {};

  if (Array.isArray(data)) {
    selectedResources.forEach(r => {
      flowData[r] = data.filter(d => d.resourceId === r || d.flowId === r);
      // Add Zero data for ticks
      ticks.forEach(tick => {
        if (!flowData[r].find(d => d.timeInMills === tick)) {
          flowData[r].push({timeInMills: tick, time: new Date(tick).toISOString(), [`${r}-value`]: 0});
        }
      });
      flowData[r] = sortBy(flowData[r], ['timeInMills']);
    });
  }

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
          <path d="M3.50478 0.666495C3.7584 -0.222166 5.0178 -0.222165 5.27141 0.666496L5.54752 1.63397C5.68356 2.11067 6.17332 2.39343 6.65418 2.2729L7.63008 2.02828C8.52649 1.80358 9.15619 2.89426 8.5134 3.55822L7.81359 4.28107C7.46878 4.63724 7.46878 5.20276 7.81359 5.55893L8.5134 6.28178C9.1562 6.94574 8.52649 8.03642 7.63008 7.81172L6.65418 7.5671C6.17332 7.44657 5.68356 7.72933 5.54752 8.20603L5.27141 9.17351C5.0178 10.0622 3.7584 10.0622 3.50478 9.1735L3.22868 8.20603C3.09264 7.72933 2.60288 7.44657 2.12202 7.5671L1.14611 7.81173C0.249704 8.03642 -0.379997 6.94574 0.262799 6.28178L0.962603 5.55893C1.30742 5.20276 1.30742 4.63724 0.962603 4.28107L0.262798 3.55822C-0.379998 2.89426 0.249705 1.80358 1.14611 2.02828L2.12202 2.2729C2.60288 2.39343 3.09264 2.11067 3.22868 1.63397L3.50478 0.666495Z" />
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
    if (active && Array.isArray(payload) && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`${moment(label).format(dateTimeFormat)}`} </p>
          {payload.map(
            p => (
              p && !!p.value && <p key={p.dataKey}> {`${getResourceName(p.name)}: ${p.value}`} </p>
            ))}
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
          // data={flowData}
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
              name={r}
              data={flowData[r]}
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
