import getUnixTime from 'date-fns/getUnixTime';

const isDate = date => Object.prototype.toString.call(date) === '[object Date]';

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

  return `from(bucket: "flowEvents") 
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
      return 'Flow: Average time taken';
  }
};

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
      timeInMills: getUnixTime(new Date(item._time)),
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
