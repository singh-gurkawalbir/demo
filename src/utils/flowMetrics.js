import startOfDay from 'date-fns/startOfDay';
import addDays from 'date-fns/addDays';
import endOfDay from 'date-fns/endOfDay';
import addHours from 'date-fns/addHours';
import addMinutes from 'date-fns/addMinutes';
import moment from 'moment';
import * as d3 from 'd3';
import addMonths from 'date-fns/addMonths';
import { convertUtcToTimezone } from './date';

export const isDate = date => Object.prototype.toString.call(date) === '[object Date]';

export const getRoundedDate = (d = new Date(), offsetInMins, isFloor) => {
  const ms = 1000 * 60 * offsetInMins; // convert minutes to ms

  return new Date(isFloor ? (Math.floor(d.getTime() / ms) * ms) : (Math.ceil(d.getTime() / ms) * ms));
};

export const getDateTimeFormat = (range, epochTime, preferences = {}, timezone) => {
  if (range && range.startDate && range.endDate) {
    const days = moment(range.endDate).diff(moment(range.startDate), 'days');

    if (days > 4 && days < 4 * 30) {
      return moment(epochTime).format(preferences?.dateFormat || 'MM/DD/YYYY');
    } if (days >= 4 * 30) {
      return moment(epochTime).format('MMMM');
    }
  }

  return convertUtcToTimezone(moment(epochTime).toISOString(), preferences?.dateFormat, preferences?.timeFormat, timezone);
};
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
  if (!range || typeof range !== 'object') {
    return {};
  }
  const { startDate, endDate, preset = 'custom' } = range;
  let start = startDate;
  let end = endDate;

  switch (preset) {
    case 'last15minutes':
      start = addMinutes(new Date(), -15);
      end = new Date();
      break;
    case 'last30minutes':
      start = addMinutes(new Date(), -30);
      end = new Date();
      break;
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
    ticks = domainRange.ticks(d3.timeDay.every(1)).map(t => t.getTime());
  } else {
    ticks = domainRange.ticks(d3.timeMonth.every(1)).map(t => t.getTime());
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

const getFlowFilterExpression = (resourceType, resourceId, filters) => {
  const { selectedResources } = filters;

  if (resourceType === 'integrations') {
    return `|> filter(fn: (r) => ${selectedResources.map(r => `r.f == "${r}"`).join(' or ')})`;
  }

  return `|> filter(fn: (r) => r.f == "${resourceId}")`;
};

const getISODateString = date => isDate(date) ? date.toISOString() : date;

const getFlowMetricsQueryParams = (resourceType, resourceId, filters) => {
  const { range = {} } = filters;
  let timeSrcExpression = '';
  const flowFilterExpression = getFlowFilterExpression(resourceType, resourceId, filters);
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

  if ((bucket === 'flowEvents' && duration === '1m') || (bucket === 'flowEvents_1hr' && duration === '1h')) {
    timeSrcExpression = ', timeSrc: "_start"';
  }

  return { bucket, start, end, flowFilterExpression, timeSrcExpression, duration };
};

export const getFlowMetricsQuery = (resourceType, resourceId, userId, filters) => {
  const {
    bucket,
    start,
    end,
    flowFilterExpression,
    timeSrcExpression,
    duration,
  } = getFlowMetricsQueryParams(resourceType, resourceId, filters);

  if (resourceType === 'integrations') {
    return `import "math"

    baseData = from(bucket: "${bucket}")
        |> range(start: ${start}, stop: ${end})
        |> filter(fn: (r) => r.u == "${userId}")
        ${flowFilterExpression}
        |> filter(fn: (r) => r._field == "c")
        |> aggregateWindow(every: ${duration}, fn: sum${timeSrcExpression})
        |> fill(value: 0.0)
        |> group(columns: ["_time", "f", "u", "_measurement"], mode: "by")
        |> sum()

    data1 = baseData
        |> group()
        |> pivot(rowKey: ["_time", "u", "f"], columnKey: ["_measurement"], valueColumn: "_value")
    data2 = baseData
        |> group(columns: ["_time", "_measurement", "u"], mode: "by")
        |> sum()
        |> group()
        |> pivot(rowKey: ["_time", "u"], columnKey: ["_measurement"], valueColumn: "_value")

    seiData = union(tables: [data1, data2])
        |> map(fn: (r) => ({
            _time: r._time,
            timeInMills: int(v: r._time)/1000000,
            flowId: if exists r.f then r.f else "_integrationId",
            success: if exists r.s then r.s else 0.0,
            error: if exists r.e then r.e else 0.0,
            ignored: if exists r.i then r.i else 0.0,
            averageTimeTaken: if exists r._value then r._value else 0.0,
            type: "sei"
          }))

    calculateAttPerHour = (tables=<-) =>
        (tables
            |> reduce(identity: {tc: 0.0, tt: 0.0, attph: 0.0}, fn: (r, accumulator) =>
                ({
                  tc: accumulator.tc + r.tc,
                  tt: accumulator.tt + r._value * r.tc,
                  attph: if (accumulator.tc + r.tc) > 0.0 then math.floor(x: (accumulator.tt + r._value * r.tc) / (accumulator.tc + r.tc)) else 0.0 
                })
                )
            |> set(key: "_field", value: "attph")
            |> rename(columns: {attph: "_value"}))

    attBaseData = from(bucket: "${bucket}")
        |> range(start: ${start}, stop: ${end})
        |> filter(fn: (r) => r.u == "${userId}")
        ${flowFilterExpression}
        |> filter(fn: (r) => (r._measurement == "s"))
        |> pivot(rowKey: ["_start", "_stop", "_time", "u", "f", "ei"], columnKey: ["_field"], valueColumn: "_value")
        |> aggregateWindow(every: ${duration}, fn: (column, tables=<-, outputField="att") =>
        (tables
        |> reduce(identity: {tc: 0.0, tt: 0.0, attph: 0.0}, fn: (r, accumulator) => ({tc: accumulator.tc + r.c, tt: accumulator.tt + r.att * r.c,  attph: math.floor(x: (accumulator.tt + r.att * r.c) / (accumulator.tc + r.c))}))
        |> set(key: "_field", value: outputField)
        |> rename(columns: {attph: "_value"}))${timeSrcExpression})
        |> group(columns: ["_time", "f", "u"])
        |> calculateAttPerHour()

    data3 = attBaseData
        |> group()

    data4 = attBaseData
        |> group(columns:["_time", "u"])
        |> calculateAttPerHour()
        |> group()

    attData = union(tables: [data3, data4])
    |> map(fn: (r) => ({
            _time: r._time,
            timeInMills: int(v: r._time)/1000000,
            flowId: if exists r.f then r.f else "_integrationId",
            success: if exists r.s then r.s else 0.0,
            error: if exists r.e then r.e else 0.0,
            ignored: if exists r.i then r.i else 0.0,
            averageTimeTaken: if exists r._value then r._value else 0.0,
            type: "att"
          }))

    union(tables: [seiData, attData])`;
  }

  return `import "math"

    seiBaseData = from(bucket: "${bucket}")
        |> range(start: ${start}, stop: ${end})
        |> filter(fn: (r) => r.u == "${userId}")
        |> filter(fn: (r) => r.f == "${resourceId}")
        |> filter(fn: (r) => r._field == "c")
        |> aggregateWindow(every: ${duration}, fn: sum${timeSrcExpression})

    data1 = seiBaseData
        |> group()
        |> pivot(rowKey: ["_time", "u", "f", "ei"], columnKey: ["_measurement"], valueColumn: "_value")

    data2 = seiBaseData
        |> group(columns: ["_time", "_measurement", "u"])
        |> sum()
        |> group()
        |> pivot(rowKey: ["_time", "u"], columnKey: ["_measurement"], valueColumn: "_value")

    seiData = union(tables: [data1, data2])
    |> map(fn: (r) => ({
        _time: r._time,
        timeInMills: int(v: r._time)/1000000,
        flowId: if exists r.f then r.f else "_flowId",
        resourceId: if exists r.ei then r.ei else "_flowId",
        success: if exists r.s then r.s else 0.0,
        error: if exists r.e then r.e else 0.0,
        ignored: if exists r.i then r.i else 0.0,
        averageTimeTaken: if exists r._value then r._value else 0.0,
        type: "sei"
      }))
    
    calculateAttPerHour = (tables=<-) =>
        (tables
            |> reduce(identity: {tc: 0.0, tt: 0.0, attph: 0.0}, fn: (r, accumulator) =>
                ({
                  tc: accumulator.tc + r.tc,
                  tt: accumulator.tt + r._value * r.tc,
                  attph: if (accumulator.tc + r.tc) > 0.0 then math.floor(x: (accumulator.tt + r._value * r.tc) / (accumulator.tc + r.tc)) else 0.0 
                })
                )
            |> set(key: "_field", value: "attph")
            |> rename(columns: {attph: "_value"}))

    attBaseData = from(bucket: "${bucket}")
        |> range(start: ${start}, stop: ${end})
        |> filter(fn: (r) => r.u == "${userId}")
        |> filter(fn: (r) => r.f == "${resourceId}")
        |> filter(fn: (r) => (r._measurement == "s"))
        |> pivot(rowKey: ["_start", "_stop", "_time", "u", "f", "ei"], columnKey: ["_field"], valueColumn: "_value")
        |> aggregateWindow(every: ${duration}, fn: (column, tables=<-, outputField="att") =>
        (tables
        |> reduce(identity: {tc: 0.0, tt: 0.0, attph: 0.0}, fn: (r, accumulator) => ({tc: accumulator.tc + r.c, tt: accumulator.tt + r.att * r.c,  attph: math.floor(x: (accumulator.tt + r.att * r.c) / (accumulator.tc + r.c))}))
        |> set(key: "_field", value: outputField)
        |> rename(columns: {attph: "_value"}))${timeSrcExpression})

    data3 = attBaseData
        |> group()

    data4 = attBaseData
        |> group(columns: ["_time", "f", "u"])
        |> calculateAttPerHour()
        |> group()

    attData = union(tables: [data3, data4])
    |> map(fn: (r) => ({
        _time: r._time,
        timeInMills: int(v: r._time)/1000000,
        flowId: if exists r.ei then r.f else "_flowId",
        resourceId: if exists r.ei then r.ei else "_flowId",
        success: if exists r.s then r.s else 0.0,
        error: if exists r.e then r.e else 0.0,
        ignored: if exists r.i then r.i else 0.0,
        averageTimeTaken: if exists r._value then r._value else 0.0,
        type: "att"
    }))

    union(tables: [seiData, attData])`;
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

