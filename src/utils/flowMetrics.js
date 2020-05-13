export const getFlowMetricsQuery = (flowId, userId, filters) => {
  let start;
  let end = '-1s';
  const { filterKey = 'lastDay', value = '' } = filters;

  switch (filterKey) {
    case 'lastDay':
      start = '-1d';
      break;
    case 'custom':
      ({ start, end } = value);
      break;
    default:
      start = '-1d';
      break;
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
      flowId: item.f,
      resourceId: item.ei,
      attribute: convertToFullText(item._measurement),
      field: convertToFullText(item._field),
      value: item._value,
      table: item.table,
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
