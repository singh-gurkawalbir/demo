export default function getFetchLogsPath({
  dateRange,
  selectedResources,
  functionType,
  nextPageURL,
  flowId,
  scriptId,
  fetchNextPage = false,
}) {
  let path;

  if (fetchNextPage && nextPageURL) {
    path = nextPageURL.replace('/api', '');
  } else {
    path = `/scripts/${scriptId}/logs?time_gt=${dateRange?.startDate?.getTime()}&time_lte=${dateRange?.endDate?.getTime()}`;

    if (flowId) {
      path += `&_flowId=${flowId}`;
    }
    if (selectedResources?.length) {
      selectedResources.forEach(res => {
        if (res.type === 'flows') {
          path += `&_flowId=${res.id}`;
        } else {
          path += `&_resourceId=${res.id}`;
        }
      });
    }
    if (functionType) {
      path += `&functionType=${functionType}`;
    }
  }

  return path;
}
