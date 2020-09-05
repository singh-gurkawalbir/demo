import formatDistanceStrict from 'date-fns/formatDistanceStrict';
import startOfDay from 'date-fns/startOfDay';
import addDays from 'date-fns/addDays';
import isSameDay from 'date-fns/isSameDay';
import moment from 'moment';
import * as d3 from 'd3';

const isDate = date => Object.prototype.toString.call(date) === '[object Date]';

export const getLineColor = index => {
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

export const getLegend = index => {
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

export const getTicks = (domainRange, range, isValue) => {
  let ticks;
  const days = moment(range.endDate).diff(moment(range.startDate), 'days');
  const hours = moment(range.endDate).diff(moment(range.startDate), 'hours');

  if (hours <= 1) {
    if (isValue) {
      return domainRange.ticks(d3.timeMinute.every(1)).map(t => t.getTime());
    }

    return domainRange.ticks(d3.timeMinute.every(5)).map(t => t.getTime());
  }
  if (hours > 1 && hours < 5) {
    if (isValue) {
      return domainRange.ticks(d3.timeMinute.every(1)).map(t => t.getTime());
    }

    return domainRange.ticks(d3.timeMinute.every(10)).map(t => t.getTime());
  }

  if (days < 5) {
    ticks = domainRange.ticks(d3.timeHour.every(1)).map(t => t.getTime());
  } else if (days < 180) {
    ticks = domainRange.ticks(d3.timeHour.every(24)).map(t => t.getTime());
  } else {
    ticks = domainRange.ticks(d3.timeHour.every(24 * 30)).map(t => t.getTime());
  }

  return ticks;
};
export const getXAxisFormat = range => {
  const days = moment(range.endDate).diff(moment(range.startDate), 'days');
  let xAxisFormat;

  if (days < 2) {
    xAxisFormat = 'HH:mm';
  } else if (days < 90) {
    xAxisFormat = 'MM/DD/YY';
  } else {
    xAxisFormat = 'MMM';
  }

  return xAxisFormat;
};

export const getInterval = range => {
  const {startDate, endDate} = range || {};
  const distanceInDays = moment(endDate).diff(moment(startDate), 'days');

  if (distanceInDays > 90 && distanceInDays < 180) {
    return 24;
  }
  if (distanceInDays > 180) {
    return 30;
  }

  return undefined;
};

export const getDurationLabel = (ranges = [], customPresets = []) => {
  const { startDate, endDate } = ranges[0] || {};
  const {startDate: lastRunStartDate, endDate: lastRunEndDate} = customPresets[0]?.range() || {};

  if (!startDate && !endDate) { return 'Please select a range'; }
  if (startDate?.toISOString() === lastRunStartDate?.toISOString() &&
    endDate?.toISOString() === lastRunEndDate?.toISOString()) {
    return 'Last run';
  }

  const distance = formatDistanceStrict(startDate, endDate, { unit: 'day' });
  const distanceInHours = formatDistanceStrict(startDate, endDate, {
    unit: 'hour',
  });
  const distanceInMonths = formatDistanceStrict(startDate, endDate, {
    unit: 'month',
  });
  const startOfToday = startOfDay(new Date());
  const startOfYesterday = startOfDay(addDays(new Date(), -1));

  switch (distance) {
    case '0 days':
      if (startDate.toISOString() === startOfToday.toISOString()) {
        return 'Today';
      }

      return `Last ${distanceInHours}`;

    case '1 day':
      if (startDate.toISOString() === startOfToday.toISOString()) {
        return 'Today';
      }
      if (startDate.toISOString() === startOfYesterday.toISOString()) {
        return 'Yesterday';
      }
      if (distanceInHours === '12 hours') {
        return 'Last 12 hours';
      }
      if (
        distanceInHours === '24 hours' &&
        isSameDay(addDays(new Date(), -1), startDate) &&
        isSameDay(new Date(), endDate)
      ) {
        return 'Last 24 hours';
      }

      return 'Custom';
    default:
      if (!['0 months', '1 month'].includes(distanceInMonths) && isSameDay(new Date(), endDate)) {
        return `Last ${distanceInMonths}`;
      } if (isSameDay(new Date(), endDate)) {
        return `Last ${distance}`;
      }

      return 'Custom';
  }
};

const getFlowFilterExpression = (flowId, filters) => {
  const {selectedResources} = filters;

  if (selectedResources && selectedResources.length) {
    return `|> filter(fn: (r) => ${selectedResources.map(r => `r.f == "${r}"`).join(' or ')})`;
  }

  return `|> filter(fn: (r) => r.f == "${flowId}")`;
};

export const getFlowMetricsQuery = (flowId, userId, filters) => {
  const { range = {} } = filters;
  const flowFilterExpression = getFlowFilterExpression(flowId, filters);
  let start = '-1d';
  let end = '-1s';

  if (isDate(range.startDate)) {
    start = range.startDate.toISOString();
  } else if (range.startDate) {
    start = range.startDate;
  }

  if (isDate(range.endDate)) {
    end = range.endDate.toISOString();
  } else if (range.endDate) {
    end = range.endDate;
  }

  const days = moment(end).diff(moment(start), 'days');
  const hours = moment(end).diff(moment(start), 'hours');
  const startDateFromToday = moment(start).diff(moment(), 'days');

  /*
    Last 1 hour: minute granularity
    Last 4 hours: minute granularity
    Last 1 - 4 days: hourly granularity
    Else, daily granularity
    flowEvents bucket -> 1 min granularity
    flowEvents_1hr -> 1 hour granularity
  */
  const bucket = (days > 4 || startDateFromToday > 7) ? 'flowEvents_1hr' : 'flowEvents';

  // If duration is more than 4 days, aggregate for 1d
  let duration;

  if (hours < 5 && startDateFromToday < 7) {
    duration = '1m';
  } else if (days > 4) {
    duration = '1d';
  } else {
    duration = '1h';
  }
  const aggregrate = `|> aggregateWindow(every: ${duration}, fn: sum)`;

  return `from(bucket: "${bucket}")
    |> range(start: ${start}, stop: ${end})
    |> filter(fn: (r) => r.u == "${userId}")
    ${flowFilterExpression}
    |> filter(fn: (r) => r._field == "c")
    ${aggregrate}
    |> drop(columns: ["_start", "_stop"])
    |> pivot(rowKey: ["_time"], columnKey: ["_measurement"], valueColumn: "_value")
    |> map(fn: (r) => ({
      r with
      time: r._time,
      flowId: r.f,
      success: r["s"],
      error: r["e"],
      ignored: r["i"],
      resourceId: r["ei"],
      averageTimeTaken: r["att"]
    }))
    |> drop(columns: ["_start", "_stop","ei","f","u","s","e","i"])`;
};

export const getFlowMetricsAttQuery = (flowId, userId, filters) => {
  const { range = {} } = filters;
  const flowFilterExpression = getFlowFilterExpression(flowId, filters);

  let start = '-1d';
  let end = '-1s';

  if (isDate(range.startDate)) {
    start = range.startDate.toISOString();
  } else if (range.startDate) {
    start = range.startDate;
  }

  if (isDate(range.endDate)) {
    end = range.endDate.toISOString();
  } else if (range.endDate) {
    end = range.endDate;
  }

  const days = moment(end).diff(moment(start), 'days');
  const hours = moment(end).diff(moment(start), 'hours');
  const startDateFromToday = moment(start).diff(moment(), 'days');

  /*
    Last 1 hour: minute granularity
    Last 4 hours: minute granularity
    Last 1 - 4 days: hourly granularity
    Else, daily granularity
    flowEvents bucket -> 1 min granularity
    flowEvents_1hr -> 1 hour granularity
  */
  const bucket = (days > 4 || startDateFromToday > 7) ? 'flowEvents_1hr' : 'flowEvents';

  // If duration is more than 4 days, aggregate for 1d
  let duration;

  if (hours < 5 && startDateFromToday < 7) {
    duration = '1m';
  } else if (days > 4) {
    duration = '1d';
  } else {
    duration = '1h';
  }

  return `from(bucket: "${bucket}")
    |> range(start: ${start}, stop: ${end})
    |> filter(fn: (r) => r.u == "${userId}")
    ${flowFilterExpression}
    |> filter(fn: (r) => (r._measurement == "s"))
    |> pivot(rowKey: ["_start", "_stop", "_time", "u", "f", "ei"], columnKey: ["_field"], valueColumn: "_value")
    |> aggregateWindow(every: ${duration}, fn: (column, tables=<-, outputField="att") =>
    (tables
    |> reduce(identity: {tc: 0.0, tt: 0.0, attph: 0.0}, fn: (r, accumulator) => ({tc: accumulator.tc + r.c, tt: accumulator.tt + r.att * r.c, attph: (accumulator.tt + r.att * r.c) / (accumulator.tc + r.c)})
    )
    |> drop(columns: ["tc", "tt"])
    |> set(key: "_field", value: outputField)
    |> rename(columns: {attph: "_value"})))
    |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")
    |> map(fn: (r) => ({
        r with
        time: r._time,
        flowId: r.f,
        resourceId: r.ei,
        averageTimeTaken: r["att"]
      }))
    |> drop(columns: ["_start", "_stop","ei","f","u"])`;
};

export const getLabel = key => {
  switch (key) {
    case 'success':
      return 'Flow: Success';
    case 'error':
      return 'Flow: Errors';
    case 'ignored':
      return 'Flow: Ignored';
    default:
      return 'Average processing time/success record';
  }
};

export const getAxisLabel = key => {
  switch (key) {
    case 'success':
      return '# of Successes';
    case 'error':
      return '# of Errors';
    case 'ignored':
      return '# of Ignores';
    default:
      return 'Average processing time (ms)';
  }
};

export const getAxisLabelPosition = id => id === 'averageTimeTaken' ? 'insideBottomLeft' : 'insideLeft';

export const getFlowMetrics = (metrics, measurement) => {
  if (metrics.data) return metrics.data[measurement];
};

export const parseFlowMetricsJson = response => {
  if (!response || !response.length) {
    return [];
  }

  return response
    .map(item => ({
      timeInMills: new Date(item._time).getTime(),
      success: +item.success || 0,
      error: +item.error || 0,
      ignored: +item.ignored || 0,
      averageTimeTaken: +item.averageTimeTaken || 0,
      resourceId: item.resourceId,
      flowId: item.flowId,
    }));
};
