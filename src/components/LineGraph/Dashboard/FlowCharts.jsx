import React, { useEffect, useMemo, useState } from 'react';
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
import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { Spinner} from '@celigo/fuse-ui';
import PanelHeader from '../../PanelHeader';
import {
  getLabel,
  getAxisLabel,
  getXAxisFormat,
  getTicks,
  getLineColor,
  getLegend,
  getDateTimeFormat,
} from '../../../utils/flowMetrics';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import {COMM_STATES} from '../../../reducers/comms/networkComms';
import { LINE_GRAPH_CATEGORIES, LINE_GRAPH_TYPES, RESOLVED_GRAPH_DATAPOINTS } from '../../../constants';
import { getIcon, DataIcon, getResourceName } from '../Common';

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
    background: theme.palette.background.paper,
    color: theme.palette.secondary.main,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    padding: '1px 4px',
    borderRadius: 2,
  },
  responsiveContainer: {
    background: theme.palette.background.paper,
    padding: theme.spacing(2),
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    marginBottom: theme.spacing(4),
  },
  legendTextWrapper: {
    padding: theme.spacing(1),
  },
}));

const flowsConfig = { type: 'flows' };

const Chart = ({ attribute, integrationId, range, selectedResources }) => {
  const classes = useStyles();
  const [opacity, setOpacity] = useState({});
  const isResolvedGraph = attribute === LINE_GRAPH_TYPES.RESOLVED;
  let mouseHoverTimer;
  const resourceList = useSelectorMemo(
    selectors.makeResourceListSelector,
    flowsConfig
  );
  const dateFormat = useSelector(state => selectors.userProfilePreferencesProps(state)?.dateFormat);

  const flowResources = useMemo(
    () => {
      const flows = resourceList.resources &&
      resourceList.resources.filter(flow =>
        (integrationId === 'none' ? !flow._integrationId : flow._integrationId === integrationId))
        .map(f => ({_id: f._id, name: f.name}));

      return [{_id: integrationId, name: 'Integration-level'}, ...flows];
    },
    [resourceList.resources, integrationId]
  );
  const { startDate, endDate } = range;
  const domainRange = d3.scaleTime().domain([new Date(startDate), new Date(endDate)]);
  const domain = [new Date(startDate).getTime(), new Date(endDate).getTime()];
  const ticks = getTicks(domainRange, range);
  const flowData = useSelectorMemo(selectors.mkLineGraphData, 'integrations', integrationId, attribute, selectedResources);

  const handleMouseEnter = e => {
    const targetId = e?.target?.id;

    if (!targetId || typeof targetId !== 'string') {
      return false;
    }
    const resourceId = targetId.split('-')[0];

    if (resourceId) {
      mouseHoverTimer = setTimeout(() => {
        const collection = isResolvedGraph ? RESOLVED_GRAPH_DATAPOINTS : selectedResources;
        const object = collection.reduce((acc, cur) => {
          acc[cur] = resourceId === cur ? 1 : 0.2;

          return acc;
        }, {});

        setOpacity(object);
      }, 10);
    }
  };

  const handleMouseLeave = () => {
    clearTimeout(mouseHoverTimer);
    setOpacity({});
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
                key={entry.value}
                id={entry.value}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}>
                {getResourceName({name: entry.value, isResolvedGraph, flowResources})}
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
    const preferences = useSelector(state => selectors.userOwnPreferences(state));
    const timezone = useSelector(state => selectors.userTimezone(state));

    if (active && Array.isArray(payload) && payload.length) {
      return (
        <div className={classes.CustomTooltip}>
          <p className="label">{getDateTimeFormat(range, label, preferences, timezone)} </p>
          {payload.map(
            p => (
              p && !!p.value && <p key={p.name}> {`${getResourceName({name: p.name, isResolvedGraph, flowResources})}: ${p.value}`} </p>
            ))}
        </div>
      );
    }

    return null;
  }
  const lineData = isResolvedGraph ? RESOLVED_GRAPH_DATAPOINTS : selectedResources;

  return (
    <div className={classes.responsiveContainer}>
      <PanelHeader title={getLabel(attribute)} />
      <ResponsiveContainer width="100%" height={400} >
        <LineChart
          margin={{
            top: 5,
            right: 30,
            left: 40,
            bottom: 5,
          }}>
          <XAxis
            dataKey="timeInMills"
            domain={domain}
            scale="time"
            type="number"
            allowDuplicatedCategory={false}
            ticks={ticks}
            tickFormatter={unixTime => unixTime ? moment(unixTime).format(getXAxisFormat(range, dateFormat)) : ''}
          />
          <YAxis
            yAxisId={attribute}
            type="number"
            label={{
              value: getAxisLabel(attribute),
              angle: -90,
              offset: -20,
              position: 'insideLeft',
              style: { textAnchor: 'middle' },
            }}
            domain={[() => 0, dataMax => dataMax + 10]}
          />

          <Tooltip content={<CustomTooltip />} />
          <Legend align="center" content={<CustomLegend />} />
          {lineData.map((r, i) => (
            <Line
              key={`${r}-${attribute}`}
              dataKey="value"
              name={`${r}-${attribute}`}
              data={flowData[r]}
              yAxisId={attribute}
              dot={false}
              activeDot={<CustomizedDot idx={i} />}
              strokeWidth="2"
              strokeOpacity={opacity[r] || 1}
              legendType={getLegend(i)}
              stroke={getLineColor(i)}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default function FlowCharts({ integrationId, range, selectedResources, refresh }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [sendQuery, setSendQuery] = useState(!!selectedResources.length);

  const data =
    useSelector(
      state => selectors.flowMetricsData(state, integrationId),
      shallowEqual
    ) || {};

  useEffect(() => {
    if (selectedResources.length) {
      setSendQuery(true);
    }
  }, [selectedResources, range, refresh]);

  useEffect(() => {
    if (sendQuery) {
      dispatch(actions.flowMetrics.request('integrations', integrationId, { range, selectedResources }));
      setSendQuery(false);
    }
  }, [data, dispatch, integrationId, range, sendQuery, selectedResources]);

  if (data.status === COMM_STATES.LOADING) {
    return (
      <Spinner center="horizontal" size="large" sx={{mb: 1}} />
    );
  }
  if (data.status === COMM_STATES.ERROR) {
    return <Typography>Error occured</Typography>;
  }

  return (
    <div className={classes.root}>
      {LINE_GRAPH_CATEGORIES.map(category => (
        <Chart
          key={category}
          attribute={category}
          range={range}
          integrationId={integrationId}
          selectedResources={selectedResources}
        />
      ))}
    </div>
  );
}
