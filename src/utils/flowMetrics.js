import moment from 'moment';
import momenttz from 'moment-timezone';
import * as d3 from 'd3';
import { getTimezoneOffset } from 'date-fns-tz';
import { convertUtcToTimezone } from './date';

export const isDate = date => Object.prototype.toString.call(date) === '[object Date]';

export const getRoundedDate = (d = new Date(), offsetInMins, isFloor) => {
  if (!d) return d;
  const ms = 1000 * 60 * offsetInMins; // convert minutes to ms

  return new Date(isFloor ? (Math.floor(d.getTime() / ms) * ms) : (Math.ceil(d.getTime() / ms) * ms));
};

export const getDateTimeFormat = (range, epochTime, preferences = {}, timezone) => {
  if (range && range.startDate && range.endDate) {
    const days = moment(range.endDate).diff(moment(range.startDate), 'days');
    const time = convertUtcToTimezone(moment(epochTime).toISOString(), null, null, timezone, {skipFormatting: true});

    if (days > 4 && days < 4 * 30) {
      return `${time.format(preferences?.dateFormat || 'MM/DD/YYYY')}`;
    } if (days >= 4 * 30) {
      return time.format('MMMM');
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

export const getSelectedRange = (range, skipLastEndDate) => {
  if (!range || typeof range !== 'object') {
    return {};
  }
  const { startDate, endDate, preset = 'custom' } = range;
  let start = startDate;
  let end = endDate;

  // if skipLastEndDate is true, end date is skipped for 'last x' preset types
  const currentDate = skipLastEndDate ? null : moment().toDate();

  switch (preset) {
    case 'lastmin':
      start = moment().subtract(1, 'minutes').toDate();
      end = currentDate;
      break;
    case 'last5min':
      start = moment().subtract(5, 'minutes').toDate();
      end = currentDate;
      break;
    case 'last15minutes':
      start = moment().subtract(15, 'minutes').toDate();
      end = currentDate;
      break;
    case 'last30minutes':
      start = moment().subtract(30, 'minutes').toDate();
      end = currentDate;
      break;
    case 'last1hour':
      start = moment().subtract(1, 'hours').toDate();
      end = currentDate;
      break;
    case 'last4hours':
      start = moment().subtract(4, 'hours').toDate();
      end = currentDate;
      break;
    case 'last6hours':
      start = moment().subtract(6, 'hours').toDate();
      end = currentDate;
      break;
    case 'last12hours':
      start = moment().subtract(12, 'hours').toDate();
      end = currentDate;
      break;
    case 'last24hours':
      start = moment().subtract(24, 'hours').toDate();
      end = currentDate;
      break;
    case 'today':
      start = moment().startOf('day').toDate();
      end = currentDate;
      break;
    case 'yesterday':
      start = moment().subtract(1, 'days').startOf('day').toDate();
      end = moment().subtract(1, 'days').endOf('day').toDate();
      break;
    case 'last7days':
      start = moment().subtract(6, 'days').startOf('day').toDate();
      end = currentDate;
      break;
    case 'last15days':
      start = moment().subtract(14, 'days').startOf('day').toDate();
      end = currentDate;
      break;
    case 'last30days':
      start = moment().subtract(29, 'days').startOf('day').toDate();
      end = currentDate;
      break;
    case 'last3months':
      start = moment().subtract(3, 'months').startOf('day').toDate();
      end = currentDate;
      break;
    case 'last6months':
      start = moment().subtract(6, 'months').startOf('day').toDate();
      end = currentDate;
      break;
    case 'last9months':
      start = moment().subtract(9, 'months').startOf('day').toDate();
      end = currentDate;
      break;
    case 'lastyear':
      start = moment().subtract(1, 'years').startOf('day').toDate();
      end = currentDate;
      break;
    case 'after14days':
      start = moment().toDate();
      end = moment().add(13, 'days').endOf('day').toDate();
      break;
    case 'after30days':
      start = moment().toDate();
      end = moment().add(29, 'days').endOf('day').toDate();
      break;
    case 'after6months':
      start = moment().toDate();
      end = moment().add(6, 'months').endOf('day').toDate();
      break;
    case 'after1year':
      start = moment().toDate();
      end = moment().add(1, 'years').endOf('day').toDate();
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

  if (!domainRange || !domainRange.ticks) {
    return [];
  }
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
  if (!range || typeof range !== 'object') {
    return '';
  }
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

  if (selectedResources.includes(resourceId)) {
    return `|> filter(fn: (r) => r.f == "${resourceId}")`;
  }

  return `|> filter(fn: (r) => r.f == "${resourceId}")
          |> filter(fn: (r) => ${selectedResources.map(r => `r.ei == "${r}"`).join(' or ')})`;
};

const getISODateString = date => isDate(date) ? date.toISOString() : date;

const getFlowMetricsQueryParams = (resourceType, resourceId, filters) => {
  const { range = {}, timezone } = filters;
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

  if ((bucket === 'flowEvents' && duration === '1m') || (bucket === 'flowEvents_1hr' && duration === '1h') || ['1d', '1mo'].includes(duration)) {
    timeSrcExpression = ', timeSrc: "_start"';
  }

  const timezoneOffsetExpression = `|> timeShift(duration: ${(getTimezoneOffset(timezone || momenttz.tz.guess()) / (1000 * 60))}m)`;
  const resetTimezoneExpression = `|> timeShift(duration: ${-(getTimezoneOffset(timezone || momenttz.tz.guess()) / (1000 * 60))}m)`;

  return { bucket, start, end, flowFilterExpression, timeSrcExpression, duration, timezoneOffsetExpression, resetTimezoneExpression };
};

export const getFlowMetricsQuery = (resourceType, resourceId, userId, filters) => {
  const {
    bucket,
    start,
    end,
    flowFilterExpression,
    timezoneOffsetExpression,
    resetTimezoneExpression,
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
        ${timezoneOffsetExpression}
    
    seiBaseData = baseData
        |> filter(fn: (r) => r._measurement != "r")
        |> aggregateWindow(every: ${duration}, fn: sum${timeSrcExpression})
        |> fill(value: 0.0)
        |> group(columns: ["_time", "f", "u", "_measurement"], mode: "by")
        |> sum()
  
    resolvedBaseData = baseData
        |> filter(fn: (r) => r._measurement == "r")
        |> map(fn: (r) => ({ r with by: if r.by == "autopilot" then "autopilot" else "users"}))
        |> aggregateWindow(every: ${duration}, fn: sum${timeSrcExpression})
        |> fill(value: 0.0)
        

    flowsData = seiBaseData
        |> group()
    resolvedData = resolvedBaseData
        |> group(columns: ["_time", "u", "_measurement", "by"], mode: "by")
        |> sum()
        |> group()
    integrationData = seiBaseData
        |> group(columns: ["_time", "_measurement", "u"], mode: "by")
        |> sum()
        |> group()

    seiData = union(tables: [flowsData, integrationData])
    seirData = union(tables: [seiData, resolvedData])
        ${resetTimezoneExpression}
        |> map(fn: (r) => ({
            _time: r._time,
            timeInMills: int(v: r._time)/1000000,
            flowId: if exists r.f then r.f else "_integrationId",
            value: if exists r._value then r._value else 0.0,
            attribute: if exists r._measurement then r._measurement else "unknown",
            by: r.by,
            type: "sei"
          }))

    calculateAttPerHour = (tables=<-) =>
        (tables
            |> reduce(identity: {tc: 0.0, tt: 0.0, attph: 0.0}, fn: (r, accumulator) =>
                ({
                  tc: if exists r.tc and exists r._value then accumulator.tc + r.tc else accumulator.tc,
                  tt: if exists r.tc and exists r._value then accumulator.tt + r._value * r.tc else accumulator.tt,
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
        ${timezoneOffsetExpression}
        |> pivot(rowKey: ["_start", "_stop", "_time", "u", "f", "ei"], columnKey: ["_field"], valueColumn: "_value")
        |> aggregateWindow(every: ${duration}, fn: (column, tables=<-, outputField="att") =>
        (tables
        |> reduce(identity: {tc: 0.0, tt: 0.0, attph: 0.0}, fn: (r, accumulator) => 
              ({
                tc: if exists r.c and exists r.att then accumulator.tc + r.c else accumulator.tc,
                tt: if exists r.c and exists r.att then accumulator.tt + r.att * r.c else accumulator.tt,  
                attph: if exists r.c and exists r.att then math.floor(x: (accumulator.tt + r.att * r.c) / (accumulator.tc + r.c)) else accumulator.attph
              })
            )
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
    ${resetTimezoneExpression}
    |> map(fn: (r) => ({
            _time: r._time,
            timeInMills: int(v: r._time)/1000000,
            flowId: if exists r.f then r.f else "_integrationId",
            value: if exists r._value then r._value else 0.0,
            attribute: "att",
            by: "",
            type: "att"
          }))

    union(tables: [seirData, attData])`;
  }

  return `import "math"

    flowData = from(bucket: "${bucket}")
        |> range(start: ${start}, stop: ${end})
        |> filter(fn: (r) => r.u == "${userId}")
        ${flowFilterExpression}
        ${timezoneOffsetExpression}

    seiBaseData = flowData
        |> filter(fn: (r) => r._field == "c" and r._measurement != "r")
        |> aggregateWindow(every: ${duration}, fn: sum${timeSrcExpression})

    resolvedData = flowData
        |> filter(fn: (r) => r._measurement == "r")
        |> map(fn: (r) => ({ r with by: if r.by == "autopilot" then "autopilot" else "users"}))
        |> aggregateWindow(every: ${duration}, fn: sum${timeSrcExpression})
        |> group(columns: ["_time", "u", "_measurement", "by"], mode: "by")
        |> sum()
        |> group()

    data1 = seiBaseData
        |> group()

    data2 = seiBaseData
        |> group(columns: ["_time", "_measurement", "u"])
        |> sum()
        |> group()

    seiData = union(tables: [data1, data2])
    seirData = union(tables: [seiData, resolvedData])
    ${resetTimezoneExpression}
    |> map(fn: (r) => ({
        _time: r._time,
        timeInMills: int(v: r._time)/1000000,
        flowId: if exists r.f then r.f else "_flowId",
        resourceId: if exists r.ei then r.ei else "_flowId",
        attribute: if exists r._measurement then r._measurement else "unknown",
        value: if exists r._value then r._value else 0.0,
        by: r.by,
        type: "sei"
      }))
    
    calculateAttPerHour = (tables=<-) =>
        (tables
            |> reduce(identity: {tc: 0.0, tt: 0.0, attph: 0.0}, fn: (r, accumulator) =>
                ({
                  tc: if exists r.tc and exists r._value then accumulator.tc + r.tc else accumulator.tc,
                  tt: if exists r.tc and exists r._value then accumulator.tt + r._value * r.tc else accumulator.tt,
                  attph: if (accumulator.tc + r.tc) > 0.0 then math.floor(x: (accumulator.tt + r._value * r.tc) / (accumulator.tc + r.tc)) else 0.0 
                })
                )
            |> set(key: "_field", value: "attph")
            |> rename(columns: {attph: "_value"}))

    attBaseData = flowData
        |> filter(fn: (r) => (r._measurement == "s"))
        |> pivot(rowKey: ["_start", "_stop", "_time", "u", "f", "ei"], columnKey: ["_field"], valueColumn: "_value")
        |> aggregateWindow(every: ${duration}, fn: (column, tables=<-, outputField="att") =>
        (tables
        |> reduce(identity: {tc: 0.0, tt: 0.0, attph: 0.0}, fn: (r, accumulator) => 
              ({
                tc: if exists r.c and exists r.att then accumulator.tc + r.c else accumulator.tc, 
                tt: if exists r.c and exists r.att then accumulator.tt + r.att * r.c else accumulator.tt, 
                attph: if exists r.c and exists r.att then math.floor(x: (accumulator.tt + r.att * r.c) / (accumulator.tc + r.c)) else accumulator.attph 
              })
            )
        |> set(key: "_field", value: outputField)
        |> rename(columns: {attph: "_value"}))${timeSrcExpression})

    data3 = attBaseData
        |> group()

    data4 = attBaseData
        |> group(columns: ["_time", "f", "u"])
        |> calculateAttPerHour()
        |> group()

    attData = union(tables: [data3, data4])
    ${resetTimezoneExpression}
    |> map(fn: (r) => ({
        _time: r._time,
        timeInMills: int(v: r._time)/1000000,
        flowId: if exists r.ei then r.f else "_flowId",
        resourceId: if exists r.ei then r.ei else "_flowId",
        value: if exists r._value then r._value else 0.0,
        attribute: "att",
        by: r.by,
        type: "att"
    }))

    union(tables: [seirData, attData])`;
};

export const getLabel = key => {
  switch (key) {
    case 'success':
      return 'Flow: Success';
    case 'error':
      return 'Flow: Errors';
    case 'ignored':
      return 'Flow: Ignored';
    case 'resolved':
      return 'Flow: Resolved';
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
    case 'resolved':
      return '# of Resolved';
    default:
      return 'Average processing time (ms)';
  }
};

