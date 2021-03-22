import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import uniq from 'lodash/uniq';
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
import PanelHeader from '../../PanelHeader';
import {
  getLabel,
  getAxisLabel,
  getXAxisFormat,
  getTicks,
  getLineColor,
  getLegend,
  getDateTimeFormat,
  getShortIdofMeasurement,
} from '../../../utils/flowMetrics';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import Spinner from '../../Spinner';
import RequiredIcon from '../../icons/RequiredIcon';
import OptionalIcon from '../../icons/OptionalIcon';
import ConditionalIcon from '../../icons/ConditionalIcon';
import PreferredIcon from '../../icons/PreferredIcon';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import {COMM_STATES} from '../../../reducers/comms/networkComms';

const useStyles = makeStyles(theme => ({
  root: {
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

const Chart = ({ id, integrationId, flowId, range, selectedResources: selected }) => {
  const classes = useStyles();
  const [opacity, setOpacity] = useState({});
  let mouseHoverTimer;
  const { data = [] } =
    useSelector(state => selectors.flowMetricsData(state, flowId)) || {};
  const flowResources = useSelectorMemo(selectors.mkFlowResources, flowId);
  // Selected resources are read from previously saved resources in preferences which may not be valid anymore. pick only valid resources.
  const selectedResources = selected.filter(r => flowResources.find(res => res._id === r));
  const availableUsers = useSelector(state => selectors.availableUsersList(state, integrationId));
  const currentUser = useSelector(state => selectors.userProfile(state));
  const { startDate, endDate } = range;
  const domainRange = d3.scaleTime().domain([new Date(startDate), new Date(endDate)]);
  const ticks = getTicks(domainRange, range);
  const domain = [new Date(startDate).getTime(), new Date(endDate).getTime()];
  const flowData = {};
  const users = Array.isArray(data) ? uniq(data.map(item => item.by)).filter(Boolean) : [];
  const lineData = id === 'resolved' ? users : selectedResources;

  if (Array.isArray(data)) {
    if (id === 'resolved') {
      users.forEach(user => {
        flowData[user] = data.filter(d => d.by === user && d.attribute === 'r');
        flowData[user] = sortBy(flowData[user], ['timeInMills']);
      });
    } else {
      selectedResources.forEach(r => {
        flowData[r] = data.filter(d => (r === flowId ? d.resourceId === '_flowId' : d.resourceId === r) && d.attribute === getShortIdofMeasurement(id));
        flowData[r] = sortBy(flowData[r], ['timeInMills']);
      });
    }
  }

  const getResourceName = name => {
    if (!name || typeof name !== 'string') {
      return name || '';
    }
    const resourceId = name.split('-')[0];

    if (resourceId === 'autopilot') {
      return 'Auto resolved';
    }
    let modifiedName = resourceId;
    const resource = flowResources.find(r => r._id === resourceId);
    const user = availableUsers.find(user => user?.sharedWithUser._id === resourceId)?.sharedWithUser;

    if (resource) {
      modifiedName = resource.name;
    } else if (user) {
      modifiedName = user.name;
    } else if (resourceId === currentUser?._id) {
      modifiedName = currentUser.name || currentUser.email;
    }

    return modifiedName;
  };

  const handleMouseEnter = e => {
    const targetId = e?.target?.id;

    if (!targetId || typeof targetId !== 'string') {
      return false;
    }
    const resourceId = targetId.split('-')[0];

    if (resourceId) {
      mouseHoverTimer = setTimeout(() => {
        const collection = id === 'resolved' ? users : selectedResources;
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
    const preferences = useSelector(
      state => selectors.userOwnPreferences(state),
      (left, right) =>
        left &&
        right &&
        left.dateFormat === right.dateFormat &&
        left.timeFormat === right.timeFormat
    );
    const timezone = useSelector(state => selectors.userTimezone(state));

    if (active && Array.isArray(payload) && payload.length) {
      payload.sort((a, b) => {
        const aIndex = flowResources.findIndex(r => r._id === a?.payload?.resourceId) || -1;
        const bIndex = flowResources.findIndex(r => r._id === b?.payload?.resourceId) || -1;

        return aIndex - bIndex;
      });

      return (
        <div className={classes.CustomTooltip}>
          <p className="label">{getDateTimeFormat(range, label, preferences, timezone)} </p>
          {payload.map(
            p => (
              p && !!p.value && <p key={p.name}> {`${getResourceName(p.name)}: ${p.value}`} </p>
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
            left: 40,
            bottom: 5,
          }}>
          <XAxis
            dataKey="timeInMills"
            domain={domain}
            scale="time"
            type="number"
            ticks={ticks}
            allowDuplicatedCategory={false}
            tickFormatter={unixTime => unixTime ? moment(unixTime).format(getXAxisFormat(range)) : ''}
          />
          <YAxis
            yAxisId={id}
            type="number"
            label={{
              value: getAxisLabel(id),
              angle: -90,
              offset: -20,
              position: 'insideLeft',
              style: { textAnchor: 'middle' },
            }}
            domain={[() => 0, dataMax => dataMax + 10]}
          />

          <Tooltip data-public content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
          {lineData.map((r, i) => (
            <Line
              key={`${r}-${id}`}
              dataKey="value"
              name={`${r}-${id}`}
              data={flowData[r]}
              yAxisId={id}
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

export default function FlowCharts({ flowId, integrationId, range, selectedResources }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const data =
    useSelector(
      state => selectors.flowMetricsData(state, flowId),
      shallowEqual
    ) || {};

  useEffect(() => {
    if (!data.data && !data.status) {
      dispatch(actions.flowMetrics.request('flows', flowId, { range }));
    }
  }, [data, dispatch, flowId, range]);

  if (data.status === COMM_STATES.LOADING) {
    return (

      <Spinner centerAll />

    );
  }
  if (data.status === COMM_STATES.ERROR) {
    return <Typography>Error occurred</Typography>;
  }

  return (
    <div className={classes.root}>
      {['success', 'averageTimeTaken', 'error', 'ignored', 'resolved'].map(m => (
        <Chart
          key={m}
          id={m}
          range={range}
          flowId={flowId}
          integrationId={integrationId}
          selectedResources={selectedResources}
        />
      ))}
    </div>
  );
}
