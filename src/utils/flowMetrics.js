import formatDistanceStrict from 'date-fns/formatDistanceStrict';
import startOfDay from 'date-fns/startOfDay';
import addDays from 'date-fns/addDays';
import isSameDay from 'date-fns/isSameDay';
import moment from 'moment';
import * as d3 from 'd3';

const isDate = date => Object.prototype.toString.call(date) === '[object Date]';

export const getTicks = (domainRange, range) => {
  let ticks;
  const days = moment(range.endDate).diff(moment(range.startDate), 'days');

  if (days < 7) {
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
    xAxisFormat = 'HH:mm:ss';
  } else if (days < 90) {
    xAxisFormat = 'MM/DD/YY';
  } else {
    xAxisFormat = 'MMM';
  }

  return xAxisFormat;
};

export const getDurationLabel = (ranges = []) => {
  const { startDate, endDate } = ranges[0] || {};
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
    case '1 day':
      if (startDate.toISOString() === startOfToday.toISOString()) {
        return 'Today';
      }
      if (startDate.toISOString() === startOfYesterday.toISOString()) {
        return 'Yesterday';
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

export const getFlowMetricsQuery = (flowId, userId, filters) => {
  const { range = {} } = filters;
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
  const bucket = days > 7 ? 'flowEvents_1hr' : 'flowEvents';

  return `from(bucket: "${bucket}") 
            |> range(start: ${start}, stop: ${end}) 
            |> filter(fn: (r) => r.u == "${userId}") 
            |> filter(fn: (r) => r.f == "${flowId}")
            |> drop(columns: ["_start", "_stop"])`;
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
      return 'Flow: Average Processing Time/Success Record';
  }
};

export const getAxisLabel = key => key === 'averageTimeTaken' ? 'Time (ms)' : '# of transmissions';

function convertToFullText(text) {
  switch (text) {
    case 's':
      return 'success';
    case 'e':
      return 'error';
    case 'ei':
      return 'resourceId';
    case 'att':
      return 'averageTimeTaken';
    case 'i':
      return 'ignored';
    case 'f':
      return 'flow';
    case 'c':
      return 'count';
    default:
      return text;
  }
}

export const getFlowMetrics = (metrics, measurement) => {
  if (metrics.data) return metrics.data[measurement];
};

export const parseFlowMetricsJson = response => {
  if (!response || !response.data || !response.data.length) {
    return [];
  }

  const metrics = {};

  response.data
    .map(item => ({
      time: item._time,
      timeInMills: new Date(item._time).getTime(),
      flowId: item.f,
      resourceId: item.ei,
      attribute: convertToFullText(item._measurement),
      field: convertToFullText(item._field),
      value: item._value,
      table: item.table,
      [`${item.ei}-value`]: parseInt(item._value, 10),
      [`${item.f}-value`]: parseInt(item._value, 10),
    }))
    .reduce((r, a) => {
      const key =
        a.attribute === 'success' && a.field === 'averageTimeTaken'
          ? a.field
          : a.attribute;

      // eslint-disable-next-line no-param-reassign
      r[key] = r[key] || [];
      r[key].push(a);

      return r;
    }, metrics);

  return metrics;
};
