import React, { useEffect } from 'react';
import clsx from 'clsx';
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
import RequiredIcon from '../../../../components/icons/RequiredIcon';
import OptionalIcon from '../../../../components/icons/OptionalIcon';
import ConditionalIcon from '../../../../components/icons/ConditionalIcon';
import PreferredIcon from '../../../../components/icons/PreferredIcon';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
    background: theme.palette.background.default,
  },
  legendIcon: {
    width: '12px',
    height: '12px',
  },
  legendText: {
    margin: theme.spacing(0, 1),
  },
  iconColor: {
    color: 'red',
  },
  '1Color': {
    color: '#2B5B36',
  },
  '2Color': {
    color: '#24448E',
  },
  '3Color': {
    color: '#3A6CA1',
  },
  '4Color': {
    color: '#549FC3',
  },
  '5Color': {
    color: '#8FC4C6',
  },
  '6Color': {
    color: '#AFCF8B',
  },
  '7Color': {
    color: '#80B875',
  },
  '8Color': {
    color: '#57A05C',
  },
  CustomTooltip: {
    background: theme.palette.common.white,
    color: theme.palette.secondary.main,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    padding: '1px 4px',
    borderRadius: 2,
  },
  responsiveContainer: {
    background: theme.palette.common.white,
    padding: theme.spacing(2),
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    marginBottom: theme.spacing(4),
  },
  legendTextWrapper: {
    padding: theme.spacing(1),
  },
}));

const getIcon = index => {
  const Symbols = [OptionalIcon, ConditionalIcon, PreferredIcon, RequiredIcon];

  return Symbols[index % 4];
};

const DataIcon = ({index}) => {
  const Icon = getIcon(index);
  const classes = useStyles();

  return (
    <Icon
      className={clsx(classes.legendIcon, classes[`${(index % 8) + 1}Color`])}
    />
  );
};

const Chart = ({ id, flowId, range, selectedResources }) => {
  const classes = useStyles();
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
  const valueTicks = getTicks(domainRange, range, true);
  const flowData = {};

  if (Array.isArray(data)) {
    selectedResources.forEach(r => {
      flowData[r] = data.filter(d => d.resourceId === r || d.flowId === r);
      // Add Zero data for ticks
      valueTicks.forEach(tick => {
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

  const CustomLegend = props => {
    const classes = useStyles();
    const { payload } = props;

    return (
      <div className={classes.legendTextWrapper}>
        {
          payload.map((entry, index) => (
            <>
              <DataIcon index={index} color={entry.payload.stroke} />
              <span
                className={clsx(classes.legendText, classes[`${(index % 8) + 1}Color`])}
                // eslint-disable-next-line react/no-array-index-key
                key={entry.dataKey + index}>
                {getResourceName(entry.value)}
              </span>
            </>
          ))
        }
      </div>
    );
  };

  const CustomizedDot = props => {
    const {
      cx, cy, value, active, idx, stroke,
    } = props;

    const size = active ? 15 : 10;
    const Icon = getIcon(idx);

    if (value) {
      return (
        <Icon
          x={cx - 5} y={cy - 5} width={size} fill={stroke}
          height={size} />
      );
    }

    return null;
  };

  function CustomTooltip({ payload, label, active }) {
    const classes = useStyles();

    if (active && Array.isArray(payload) && payload.length) {
      return (
        <div className={classes.CustomTooltip}>
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

  return (
    <div className={classes.responsiveContainer}>
      <PanelHeader title={getLabel(id)} />
      <ResponsiveContainer width="100%" height={400} >
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
              position: 'inside',
            }}
            domain={[() => 0, dataMax => dataMax + 10]}
          />

          <Tooltip content={<CustomTooltip />} />
          <Legend align="center" content={<CustomLegend />} />
          {selectedResources.map((r, i) => (
            <Line
              key={r}
              dataKey={`${r}-value`}
              name={r}
              data={flowData[r]}
              yAxisId={id}
              dot={false}
              activeDot={<CustomizedDot idx={i} />}
              strokeWidth="2"
              legendType={getLegend(i)}
              stroke={getLineColor(i)}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
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
    return <Typography>Error occured</Typography>;
  }

  return (
    <div className={classes.root}>
      {['success', 'averageTimeTaken', 'error', 'ignored'].map(m => (
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
