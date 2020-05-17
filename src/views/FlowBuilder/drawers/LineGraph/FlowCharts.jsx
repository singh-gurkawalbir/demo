import React, { useEffect, Fragment } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import moment from 'moment';
import {
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
} from 'recharts';
import { makeStyles } from '@material-ui/core';
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
const Chart = ({ id, flowId, selectedResources }) => {
  const { data: flowData } =
    useSelector(state => selectors.flowMetricsData(state, flowId, id)) || {};
  const parseValue = value => `${value}`;

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
          <CartesianGrid strokeDasharray="1 1" />
          <XAxis
            dataKey="time"
            name="Time"
            tickFormatter={unixTime => moment(unixTime).format('DD/MMM hh:mm')}
            type="category"
          />
          <YAxis
            yAxisId={id}
            type="number"
            domain={[() => 0, dataMax => dataMax]}
          />

          <Tooltip formatter={value => parseValue(value)} />
          <Legend />
          {selectedResources.map(r => (
            <Line
              key={r}
              dataKey={`${r}-value`}
              yAxisId={id}
              legendType="wye"
              stroke="#24448E"
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
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
  const data =
    useSelector(
      state => selectors.flowMetricsData(state, flowId),
      shallowEqual
    ) || {};

  useEffect(() => {
    if (!data.data && !data.status) {
      dispatch(actions.flowMetrics.request(flowId, {}));
    }
  }, [data, dispatch, flowId]);

  if (data.status === 'requested') {
    return (
      <Loader open>
        Fetching Data
        <Spinner />
      </Loader>
    );
  }

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
