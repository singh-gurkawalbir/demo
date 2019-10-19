import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import Hook from './Hook';

export default function DynaHook(props) {
  const { flowId, resourceType, resourceId } = props;
  const dispatch = useDispatch();
  const [isPreHookDataRequested, setIsPreHookDataRequested] = useState(false);
  const requestForPreHookData = () => {
    if (!isPreHookDataRequested) {
      setIsPreHookDataRequested(true);
    }
  };

  // Fetches different input data for different hook types goes here
  const fetchSampleData = useCallback(
    ({ flowId, resourceId, resourceType, stage }) => {
      if (resourceType === 'exports') {
        return actions.flowData.fetchSampleData(
          flowId,
          resourceId,
          resourceType,
          stage
        );
      }
    },
    []
  );
  // Selector to get sample data for different hook types
  const getSampleDataSelector = ({ state, flowId, resourceId, stage }) => {
    if (resourceType === 'exports') {
      const sampleData = selectors.getSampleData(
        state,
        flowId,
        resourceId,
        stage
      );

      if (sampleData) {
        return { errors: [], data: [sampleData] };
      }
    }
  };

  const preHookData = useSelector(state =>
    getSampleDataSelector({ state, flowId, resourceId, stage: 'hooks' })
  );

  useEffect(() => {
    if (!preHookData && isPreHookDataRequested) {
      dispatch(
        fetchSampleData({ flowId, resourceId, resourceType, stage: 'hooks' })
      );
    }
  }, [
    dispatch,
    fetchSampleData,
    flowId,
    isPreHookDataRequested,
    preHookData,
    resourceId,
    resourceType,
  ]);

  return (
    <Hook
      preHookData={preHookData}
      requestForPreHookData={requestForPreHookData}
      {...props}
    />
  );
}
