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
    path = `/scripts/${scriptId}/logs`;
    const queryParams = [];

    if (dateRange?.startDate) {
      queryParams.push(`time_gt=${dateRange.startDate.getTime()}`);
    }
    if (dateRange?.endDate) {
      queryParams.push(`time_lte=${dateRange.endDate.getTime()}`);
    }

    if (flowId) {
      queryParams.push(`_flowId=${flowId}`);
    }
    if (selectedResources?.length) {
      selectedResources.forEach(res => {
        if (res.type === 'flows') {
          queryParams.push(`_flowId=${res.id}`);
        } else {
          queryParams.push(`_resourceId=${res.id}`);
        }
      });
    }
    if (functionType) {
      queryParams.push(`functionType=${functionType}`);
    }

    if (queryParams.length !== 0) {
      path += `?${queryParams.join('&')}`;
    }
  }

  return path;
}
