import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import Hook from './Hook';

export default function DynaHook(props) {
  const {
    flowId,
    resourceType,
    resourceId,
    hookStage,
    isPageGenerator,
  } = props;
  const dispatch = useDispatch();
  const [isPreHookDataRequested, setIsPreHookDataRequested] = useState(false);
  const requestForPreHookData = () => {
    if (!isPreHookDataRequested) {
      setIsPreHookDataRequested(true);
    }
  };

  // Fetches different input data for different hook types goes here
  const requestSampleData = useCallback(
    ({ flowId, resourceId, resourceType, stage }) => {
      if (resourceType === 'exports') {
        return actions.flowData.requestSampleData(
          flowId,
          resourceId,
          resourceType,
          stage,
          isPageGenerator
        );
      }

      // For Imports
      return actions.flowData.requestSampleData(
        flowId,
        resourceId,
        resourceType,
        hookStage
      );
    },
    [hookStage, isPageGenerator]
  );
  // Selector to get sample data for different hook types
  const getSampleDataSelector = ({ state, flowId, resourceId, stage }) => {
    // Show empty JSON incase of out of flow context
    if (!flowId) {
      return {};
    }

    // Post Aggregate Hook is shown default data
    if (hookStage === 'postAggregate') {
      return {
        postAggregateData: {
          success: true,
          _json: {},
        },
      };
    }

    // Fetch corresponding data for specific hookStage ('preSavePage',  'preMap', 'postMap', 'postSubmit')
    const sampleData = selectors.getSampleData(
      state,
      flowId,
      resourceId,
      resourceType === 'exports' ? stage : hookStage,
      { isPageGenerator, isImport: resourceType === 'imports' }
    );

    if (sampleData) {
      return { errors: [], data: [sampleData] };
    }
  };

  const preHookData = useSelector(state =>
    getSampleDataSelector({ state, flowId, resourceId, stage: 'hooks' })
  );

  useEffect(() => {
    // Samle data is shown incase of flow context
    if (!preHookData && flowId && isPreHookDataRequested) {
      dispatch(
        requestSampleData({ flowId, resourceId, resourceType, stage: 'hooks' })
      );
    }
  }, [
    dispatch,
    requestSampleData,
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
