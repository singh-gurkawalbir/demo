import { useEffect, useCallback } from 'react';
import { cloneDeep, debounce } from 'lodash';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import {
  getAllDependentSampleDataStages,
  getSubsequentStages,
  BASE_FLOW_INPUT_STAGE,
  LOOKUP_FLOW_DATA_STAGE,
  IMPORT_FLOW_DATA_STAGE,
} from '../../../../utils/flowData';

const ELIGIBLE_RESOURCE_TYPES = ['exports', 'imports'];
const DEBOUNCE_DURATION = 300;

export default function useHandleResourceFormFlowSampleData(formKey) {
  const dispatch = useDispatch();
  const { flowId, resourceType, resourceId, initComplete, skipCommit} = useSelector(state => {
    const parentContext = selectors.formParentContext(state, formKey) || {};

    return {...parentContext};
  });
  const eligibleForFlowSampleData = initComplete && !skipCommit && ELIGIBLE_RESOURCE_TYPES.includes(resourceType);

  const isLookUpExport = useSelector(state =>
    flowId && selectors.isLookUpExport(state, { flowId, resourceId, resourceType })
  );

  const { formValues, oneToManyValues, formValuesWithoutOneToMany } = useSelector(state => {
    const formContext = selectors.formState(state, formKey) || {};
    const formValues = cloneDeep(formContext.value || {});
    const formValuesWithoutOneToMany = cloneDeep(formContext.value || {});
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
        stage: resourceType === 'exports' ? LOOKUP_FLOW_DATA_STAGE : IMPORT_FLOW_DATA_STAGE,
      })
  );

  const resetFlowInputData = useCallback(() => {
    const flowInputDependentStages = getSubsequentStages(BASE_FLOW_INPUT_STAGE, resourceType);

    dispatch(actions.flowData.resetStages(flowId, resourceId, flowInputDependentStages));
  }, [dispatch, resourceId, flowId, resourceType]);

  const resetExportSampleData = useCallback(() => {
    const exportSampleDataStages = getAllDependentSampleDataStages('responseMapping', 'exports');

    dispatch(actions.flowData.resetStages(flowId, resourceId, exportSampleDataStages));
  }, [dispatch, resourceId, flowId]);

  useEffect(() => {
    if (isLookUpExport || resourceType === 'imports') {
      debounce(resetFlowInputData, DEBOUNCE_DURATION)();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oneToManyValues]);

  useEffect(() => {
    if (isLookUpExport) {
      debounce(resetExportSampleData, DEBOUNCE_DURATION)();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValuesWithoutOneToMany]);

  useEffect(() => {
    if (resourceType === 'exports' && !isLookUpExport) {
      // standalone/PG exports  - reset everything
      debounce(() => dispatch(actions.flowData.resetStages(flowId, resourceId)), DEBOUNCE_DURATION)();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues]);

  useEffect(() =>
    () => {
      if (formKey && flowId && resourceId) {
        dispatch(actions.flowData.resetStages(flowId, resourceId));
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
            LOOKUP_FLOW_DATA_STAGE,
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
