import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import Hook from './Hook';
import LoadResources from '../../../LoadResources';

export default function DynaHook(props) {
  const {
    flowId,
    resourceType,
    resourceId,
    hookStage = 'preSavePage',
    disabled,
  } = props;
  // Lists all hooks stages with default sample data where no api call is required
  const hooksWithDefaultSampleData = ['as2routing'];
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
      const finalStage = resourceType === 'exports' ? stage : hookStage;

      return actions.flowData.requestSampleData(
        flowId,
        resourceId,
        resourceType,
        finalStage
      );
    },
    [hookStage]
  );
  // Selector to get sample data for different hook types
  // TODO @Raghu: Move all this logic to a selector
  const getSampleDataSelector = ({ state, flowId, resourceId }) => {
    // Show empty JSON incase of out of flow context
    if (!flowId) {
      return {};
    }

    if (hookStage === 'as2routing') {
      return { as2: { sample: { data: 'coming soon' } } };
    }

    // Fetch corresponding data for specific hookStage ('preSavePage',  'preMap', 'postMap', 'postSubmit')
    const { data: sampleData } = selectors.getSampleDataWrapper(state, {
      flowId,
      resourceId,
      resourceType,
      stage: hookStage,
    });

    return sampleData;
  };

  const preHookData = useSelector(state => {
    if (props.preHookData) return props.preHookData;

    return getSampleDataSelector({ state, flowId, resourceId });
  });
  const preHookDataStatus = useSelector(state => {
    // Incase of default data for hooks, return status as received
    if (props.preHookData || hooksWithDefaultSampleData.includes(hookStage)) {
      return 'received';
    }

    // returns status of sampleData state for this hookStage
    return selectors.getSampleDataWrapper(state, {
      flowId,
      resourceId,
      resourceType,
      stage: hookStage,
    }).status;
  });

  useEffect(() => {
    // Sample data is shown incase of flow context
    if (!preHookDataStatus && flowId && isPreHookDataRequested) {
      dispatch(
        requestSampleData({
          flowId,
          resourceId,
          resourceType,
          stage: hookStage,
        })
      );
    }
  }, [
    dispatch,
    requestSampleData,
    flowId,
    isPreHookDataRequested,
    resourceId,
    resourceType,
    preHookDataStatus,
    hookStage,
  ]);

  return (
    <LoadResources resources="scripts">
      <Hook
        disabled={disabled}
        preHookData={preHookData}
        requestForPreHookData={requestForPreHookData}
        {...props}
      />
    </LoadResources>
  );
}
