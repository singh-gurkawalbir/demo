import { useMemo } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { selectors } from '../reducers';
import useSelectorMemo from './selectors/useSelectorMemo';

export default function useResourceFormSampleData(resourceType, resourceId, flowId) {
  const availablePreviewStages = useSelector(state =>
    selectors.getAvailableResourcePreviewStages(state, resourceId, resourceType, flowId),
  shallowEqual
  );

  // get the map of all the stages with their respective sampleData for the stages
  const previewStages = useMemo(() => availablePreviewStages.map(({value}) => value), [availablePreviewStages]);

  const previewStageDataList = useSelectorMemo(selectors.mkPreviewStageDataList, resourceId, previewStages);

  // get the default raw stage sampleData to track the status of the request
  // As the status is same for all the stages
  const resourceSampleData = useSelector(state =>
    selectors.getResourceSampleDataWithStatus(state, resourceId, 'raw'),
  shallowEqual
  );

  return { availablePreviewStages, previewStageDataList, resourceSampleData };
}
