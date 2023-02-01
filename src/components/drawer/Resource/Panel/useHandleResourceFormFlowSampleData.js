/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import {
  getAllDependentSampleDataStages,
  getSubsequentStages,
  BASE_FLOW_INPUT_STAGE,
  EXPORT_FILTERED_DATA_STAGE,
  IMPORT_FLOW_DATA_STAGE,
} from '../../../../utils/flowData';
import { isNewId } from '../../../../utils/resource';
import customCloneDeep from '../../../../utils/customCloneDeep';

const ELIGIBLE_RESOURCE_TYPES = ['exports', 'imports'];
const DEBOUNCE_DURATION = 300;
const debounceFn = fn => debounce(fn, DEBOUNCE_DURATION);

export default function useHandleResourceFormFlowSampleData(formKey) {
  const dispatch = useDispatch();
  const { flowId, resourceType, resourceId, initComplete, skipCommit} = useSelector(state => {
    const parentContext = selectors.formParentContext(state, formKey) || {};

    return {...parentContext};
  }, shallowEqual);
  const eligibleForFlowSampleData = initComplete && !skipCommit && ELIGIBLE_RESOURCE_TYPES.includes(resourceType);

  const isLookUpExport = useSelector(state =>
    selectors.isLookUpExport(state, { flowId, resourceId, resourceType })
  );

  const { formValues, oneToManyValues, formValuesWithoutOneToMany } = useSelector(state => {
    const formContext = selectors.formState(state, formKey) || {};
    const formValues = customCloneDeep(formContext.value || {});
    const formValuesWithoutOneToMany = customCloneDeep(formContext.value || {});
    const oneToManyValues = formValues['/oneToMany'] + formValues['/pathToMany'];

    delete formValuesWithoutOneToMany['/oneToMany'];
    delete formValuesWithoutOneToMany['/pathToMany'];
    delete formValuesWithoutOneToMany['/traceKeyTemplate']; // dependent on one to many , so ignore its value too

    return {
      formValues: JSON.stringify(formValues),
      oneToManyValues,
      formValuesWithoutOneToMany: JSON.stringify(formValuesWithoutOneToMany),
    };
  }, shallowEqual);

  const flowData = useSelector(
    state =>
      selectors.getSampleDataContext(state, {
        flowId,
        resourceId,
        resourceType,
        stage: resourceType === 'exports' ? EXPORT_FILTERED_DATA_STAGE : IMPORT_FLOW_DATA_STAGE,
      })
  );

  const resetFlowInputData = useCallback(debounceFn(() => {
    const flowInputDependentStages = getSubsequentStages(BASE_FLOW_INPUT_STAGE, resourceType);

    dispatch(actions.flowData.resetStages(flowId, resourceId, flowInputDependentStages));
  }), [dispatch, resourceId, flowId, resourceType]);

  const resetExportSampleData = useCallback(debounceFn(() => {
    const exportSampleDataStages = getAllDependentSampleDataStages('postResponseMap', 'exports');

    dispatch(actions.flowData.resetStages(flowId, resourceId, exportSampleDataStages));
  }), [dispatch, resourceId, flowId]);

  const resetStages = useCallback(debounceFn(() => {
    dispatch(actions.flowData.resetStages(flowId, resourceId));
  }), [flowId, resourceId]);

  useEffect(() => {
    if (isLookUpExport || resourceType === 'imports') {
      resetFlowInputData();
    }
  }, [oneToManyValues]);

  useEffect(() => {
    if (isLookUpExport) {
      resetExportSampleData();
    }
  }, [formValuesWithoutOneToMany]);

  useEffect(() => {
    if (resourceType === 'exports' && !isLookUpExport) {
      // standalone/PG exports  - reset everything
      resetStages();
    }
  }, [formValues]);

  useEffect(() =>
    () => {
      if (formKey && flowId && resourceId) {
        if (isNewId(resourceId)) {
          // Incase of a new resource, clear sample data when the resourceForm is closed
          resetStages();
        } else {
          if (resourceType === 'exports') {
            // Incase of exports, we reset all related stages for preview data
            resetExportSampleData();
          }
          if (isLookUpExport || resourceType === 'imports') {
            // Incase of lookups and imports, reset flowInput dependent stages once closed
            resetFlowInputData();
          }
        }
      }
    },
  [flowId, resourceId, dispatch, formKey]);

  useEffect(() => {
    // fetch all possible dependent stages
    if (eligibleForFlowSampleData && !flowData.status) {
      if (isLookUpExport) {
        dispatch(
          actions.flowData.requestSampleData(
            flowId,
            resourceId,
            resourceType,
            EXPORT_FILTERED_DATA_STAGE,
            undefined,
            formKey,
          )
        );
      }
      if (flowId && resourceType === 'imports') {
        dispatch(
          actions.flowData.requestSampleData(
            flowId,
            resourceId,
            resourceType,
            IMPORT_FLOW_DATA_STAGE,
            undefined,
            formKey,
          )
        );
      }
    }
  }, [flowData?.status, dispatch, flowId, resourceType, formKey, isLookUpExport, eligibleForFlowSampleData, resourceId]);

  return null;
}
