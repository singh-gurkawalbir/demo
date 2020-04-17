import React from 'react';
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
import PanelHeader from '../../../components/PanelHeader';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
}));
const data = [
  {
    name: 'Page A',
    time: '2020-04-15T19:00:00Z',
    success: 4000,
    errors: 2400,
    ignored: 2400,
  },
  {
    name: 'Page B',
    time: '2020-04-15T20:00:00Z',
    success: 3000,
    errors: 1398,
    ignored: 2210,
  },
  {
    name: 'Page C',
    success: 2000,
    time: '2020-04-15T21:00:00Z',
    errors: 9800,
    ignored: 2290,
  },
  {
    name: 'Page D',
    success: 2780,
    time: '2020-04-15T22:00:00Z',
    errors: 3908,
    ignored: 2000,
  },
  {
    name: 'Page E',
    success: 1890,
    errors: 4800,
    time: '2020-04-15T23:00:00Z',
    ignored: 2181,
  },
  {
    name: 'Page F',
    success: 2390,
    errors: 3800,
    time: '2020-04-16T00:00:00Z',
    ignored: 2500,
  },
  {
    name: 'Page G',
    success: 3490,
    errors: 4300,
    time: '2020-04-16T01:00:00Z',
    ignored: 2100,
  },
];

export default function Recharts() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <PanelHeader title="Recharts Time Demo" />
      <LineChart
        width={730}
        height={250}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="time"
          domain={['auto', 'auto']}
          name="Time"
          tickFormatter={unixTime => moment(unixTime).format('HH:mm')}
          type="category"
        />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="success" stroke="green" />
        <Line type="monotone" dataKey="errors" stroke="red" />
        <Line type="monotone" dataKey="ignored" stroke="purple" />
      </LineChart>
      <PanelHeader title="Recharts Demo" />
      <LineChart
        width={730}
        height={250}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />

        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="success" stroke="green" />
        <Line type="monotone" dataKey="errors" stroke="red" />
        <Line type="monotone" dataKey="ignored" stroke="purple" />
      </LineChart>
    </div>
  );
}
