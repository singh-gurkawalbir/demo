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

export const parseResponse = response => response;
