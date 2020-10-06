import startOfDay from 'date-fns/startOfDay';
import addDays from 'date-fns/addDays';
import endOfDay from 'date-fns/endOfDay';
import addHours from 'date-fns/addHours';
import moment from 'moment';
import * as d3 from 'd3';
import groupBy from 'lodash/groupBy';
import flatMap from 'lodash/flatMap';
import forOwn from 'lodash/forOwn';
import addMonths from 'date-fns/addMonths';

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

export const getSelectedRange = range => {
  const {startDate, endDate, preset = 'custom'} = range;
  let start = startDate;
  let end = endDate;

  switch (preset) {
    case 'last1hour':
      start = addHours(new Date(), -1);
      end = new Date();
      break;
    case 'last4hours':
      start = addHours(new Date(), -4);
      end = new Date();
      break;
    case 'last24hours':
      start = addHours(new Date(), -24);
      end = new Date();
      break;
    case 'today':
      start = startOfDay(new Date());
      end = new Date();
      break;
    case 'yesterday':
      start = startOfDay(addDays(new Date(), -1));
      end = endOfDay(addDays(new Date(), -1));
      break;
    case 'last7days':
      start = startOfDay(addDays(new Date(), -6));
      end = new Date();
      break;
    case 'last15days':
      start = startOfDay(addDays(new Date(), -14));
      end = new Date();
      break;
    case 'last30days':
      start = startOfDay(addDays(new Date(), -29));
      end = new Date();
      break;
    case 'last3months':
      start = addMonths(new Date(), -3);
      end = new Date();
      break;
    case 'last6months':
      start = addMonths(new Date(), -6);
      end = new Date();
      break;
    case 'last9months':
      start = addMonths(new Date(), -9);
      end = new Date();
      break;
    case 'lastyear':
      start = addMonths(new Date(), -12);
      end = new Date();
      break;
    case 'lastrun':
    default:
      break;
  }

  return {...range, startDate: start, endDate: end};
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

export const getTicks = (domainRange, srange, isValue) => {
  let ticks;
  const range = getSelectedRange(srange);

  const startDateFromNowInDays = moment().diff(moment(range.startDate), 'days');
  const days = moment(range.endDate).diff(moment(range.startDate), 'days');
  const hours = moment(range.endDate).diff(moment(range.startDate), 'hours');

  if (startDateFromNowInDays < 7) {
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
  }
  if (hours <= 4 * 24) {
    ticks = domainRange.ticks(d3.timeHour.every(1)).map(t => t.getTime());
  } else if (days < 90) {
    ticks = domainRange.ticks(d3.timeHour.every(24)).map(t => t.getTime());
  } else {
    ticks = domainRange.ticks(d3.timeDay.every(30)).map(t => t.getTime());
  }

  return ticks;
};
export const getXAxisFormat = range => {
  const hours = moment(range.endDate).diff(moment(range.startDate), 'hours');
  let xAxisFormat;

  if (hours <= 24) {
    xAxisFormat = 'HH:mm';
  // } else if (hours > 24 && hours < 4 * 24) {
  //   xAxisFormat = 'ddd HH:mm';
  } else if (hours < 90 * 24) {
    xAxisFormat = 'MM/DD/YY';
  } else {
    xAxisFormat = 'MMMM';
  }

  return xAxisFormat;
};

const getFlowFilterExpression = (flowId, filters) => {
  const { selectedResources } = filters;

  if (selectedResources && selectedResources.length) {
    return `|> filter(fn: (r) => ${selectedResources.map(r => `r.f == "${r}"`).join(' or ')})`;
  }

  return `|> filter(fn: (r) => r.f == "${flowId}")`;
};

const getISODateString = date => isDate(date) ? date.toISOString() : date;

const getFlowMetricsQueryParams = (flowId, filters) => {
  const { range = {} } = filters;
  const flowFilterExpression = getFlowFilterExpression(flowId, filters);
  let start = '-1d';
  let end = '-1s';

  let { startDate, endDate } = range;

  if (range.preset !== 'custom') {
    const selectedRange = getSelectedRange(range);

    startDate = selectedRange.startDate;
    endDate = selectedRange.endDate;
  }

  start = getISODateString(startDate);
  end = getISODateString(endDate);

  const days = moment(end).diff(moment(start), 'days');
  const hours = moment(end).diff(moment(start), 'hours');
  const startDateFromToday = moment().diff(moment(start), 'days');

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
  } else if (days > 4 && days < 180) {
    duration = '1d';
  } else if (days > 180) {
    duration = '1mo';
  } else {
    duration = '1h';
  }

  return { bucket, start, end, flowFilterExpression, duration };
};

export const getFlowMetricsQuery = (flowId, userId, filters) => {
  const {
    bucket,
    start,
    end,
    flowFilterExpression,
    duration,
  } = getFlowMetricsQueryParams(flowId, filters);

  return `import "math"

  sei = from(bucket: "${bucket}")
    |> range(start: ${start}, stop: ${end})
    |> filter(fn: (r) => r.u == "${userId}")
    ${flowFilterExpression}
    |> filter(fn: (r) => r._field == "c")
    |> aggregateWindow(every: ${duration}, fn: sum)
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
    |> drop(columns: ["_start", "_stop","ei","f","u","s","e","i"])
  
    att = from(bucket: "${bucket}")
    |> range(start: ${start}, stop: ${end})
    |> filter(fn: (r) => r.u == "${userId}")
    ${flowFilterExpression}
    |> filter(fn: (r) => (r._measurement == "s"))
    |> pivot(rowKey: ["_start", "_stop", "_time", "u", "f", "ei"], columnKey: ["_field"], valueColumn: "_value")
    |> aggregateWindow(every: ${duration}, fn: (column, tables=<-, outputField="att") =>
    (tables
    |> reduce(identity: {tc: 0.0, tt: 0.0, attph: 0.0}, fn: (r, accumulator) => ({tc: accumulator.tc + r.c, tt: accumulator.tt + r.att * r.c,  attph: math.floor(x: (accumulator.tt + r.att * r.c) / (accumulator.tc + r.c))}))
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
    |> drop(columns: ["_start", "_stop","ei","f","u"])
    
    union(tables: [sei, att])
    |> group()`;
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

const add = (a = 0, b = 0) => a + b;

const addFlowEntry = (data = []) => {
  const [seiData, attData] = data.reduce((acc, cur) => {
    acc[cur.isAtt ? 1 : 0].push(cur);

    return acc;
  }, [[], []]);

  attData.forEach(item => {
    const seiItem = seiData.find(d => d.resourceId === item.resourceId);

    seiItem.averageTimeTaken = +item.averageTimeTaken || 0;
  });

  const flowEntry = seiData.reduce((acc, item) => {
    acc.type = 'flow';
    acc.resourceId = item.flowId;
    acc.timeInMills = item.timeInMills;
    acc.success = add(item.success, acc.success);
    acc.error = add(item.error, acc.error);
    acc.ignored = add(item.ignored, acc.ignored);
    acc.flowId = item.flowId;
    acc.tc += item.success;
    acc.tt += item.averageTimeTaken * item.success;
    acc.averageTimeTaken = Math.floor((acc.tt + item.averageTimeTaken * item.success) / (acc.tc + item.success));

    return acc;
  }, {tc: 0, tt: 0, attph: 0});

  seiData.push(flowEntry);

  return seiData;
};
const addFlowLevelCounts = data => {
  const groupedByTime = groupBy(data, 'timeInMills');

  Object.keys(groupedByTime).forEach(key => {
    groupedByTime[key] = addFlowEntry(groupedByTime[key]);
  });

  return flatMap(groupedByTime);
};

export const parseFlowMetricsJson = response => {
  if (!response || !response.length) {
    return [];
  }
  // remove unwanted fields
  const data = response
    .map(item => ({
      timeInMills: new Date(item._time).getTime(),
      success: +item.success || 0,
      error: +item.error || 0,
      ignored: +item.ignored || 0,
      averageTimeTaken: +item.averageTimeTaken || 0,
      resourceId: item.resourceId,
      flowId: item.flowId,
      isAtt: !!item._measurement,
    }));
  const byFlow = groupBy(data, 'flowId');
  const allFlows = [];

  forOwn(byFlow, (v, k) => {
    if (k) {
      allFlows.push(...addFlowLevelCounts(v));
    }
  });

  return allFlows.map(item => ({
    timeInMills: item.timeInMills,
    success: +item.success || 0,
    error: +item.error || 0,
    ignored: +item.ignored || 0,
    averageTimeTaken: +item.averageTimeTaken || 0,
    resourceId: item.resourceId,
    flowId: item.flowId,
    type: item.type,
  }));
};
