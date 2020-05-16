import React, { useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import {
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
} from 'recharts';
import { makeStyles } from '@material-ui/core';
import PanelHeader from '../../../../components/PanelHeader';
import * as selectors from '../../../../reducers';
import { getLabel } from '../../../../utils/flowMetrics';
import actions from '../../../../actions';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
    background: theme.palette.background.default,
  },
}));
const Chart = ({ id, flowId, selectedResources }) => {
  const { data: flowData } =
    useSelector(state => selectors.flowMetricsData(state, flowId, id)) || {};

  return (
    <Fragment>
      <PanelHeader title={getLabel(id)} />
      <LineChart
        width={930}
        height={350}
        data={flowData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}>
        <CartesianGrid strokeDasharray="1 1" />
        <XAxis
          dataKey="time"
          domain={['dataMin', 'dataMax']}
          name="Time"
          tickFormatter={unixTime => moment(unixTime).format('DD/MMM hh:mm')}
          type="category"
        />
        <YAxis type="number" domain={[0, 300]} />
        <Tooltip />
        <Legend />
        {selectedResources.map(r => (
          <Line
            key={r}
            dataKey={`${r}-value`}
            legendType="wye"
            stroke="#24448E"
          />
        ))}
      </LineChart>
    </Fragment>
  );
};

export default function FlowCharts({
  flowId,
  selectedMeasurements,
  selectedResources,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { data: flowData } =
    useSelector(state => selectors.flowMetricsData(state, flowId)) || {};

  useEffect(() => {
    if (!flowData) {
      dispatch(actions.flowMetrics.request(flowId, {}));
    }
  }, [dispatch, flowData, flowId]);

  return (
    <div className={classes.root}>
      {selectedMeasurements.map(m => (
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
