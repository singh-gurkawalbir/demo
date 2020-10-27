import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import Icon from '../../../../components/icons/OutputFilterIcon';
import OutputFilterToggleEditorDrawer from '../../../../components/AFE/FilterEditor/FilterToggleEditorDrawer';
import { hooksToFunctionNamesMap } from '../../../../utils/hooks';

function OutputFilterDrawer({
  flowId,
  resource,
  isViewMode,
  resourceType,
  onClose,
  isMonitorLevelAccess,
}) {
  const dispatch = useDispatch();
  const resourceId = resource._id;
  const { status: sampleDataStatus, data: sampleData } = useSelector(state =>
    selectors.sampleDataWrapper(state, {
      flowId,
      resourceId,
      resourceType,
      stage: 'outputFilter',
    })
  );
  const { type, rules, scriptId, entryFunction } = useMemo(() => {
    const filterObj = (resource && resource.filter) || {};
    const { type, script = {}, expression = {} } = filterObj;

    return {
      type,
      rules: expression.rules || [],
      scriptId: script._scriptId,
      entryFunction: script.function,
    };
  }, [resource]);

  useEffect(() => {
    if (!sampleDataStatus) {
      dispatch(
        actions.flowData.requestSampleData(
          flowId,
          resourceId,
          resourceType,
          'outputFilter'
        )
      );
    }
  }, [
    dispatch,
    flowId,
    resourceId,
    resourceType,
    sampleData,
    sampleDataStatus,
  ]);
  const optionalSaveParams = useMemo(
    () => ({
      processorKey: 'outputFilter',
      resourceId,
      resourceType,
      rules,
    }),
    [resourceId, resourceType, rules]
  );

  return (
    <OutputFilterToggleEditorDrawer
      title="Define output filter"
      helpKey="lookup.output.filter"
      helpTitle="Filter rules"
      disabled={isViewMode}
      isMonitorLevelAccess={isMonitorLevelAccess}
      enableFilterForIA
      id={resourceId + flowId}
      data={sampleData}
      type={type}
      rule={rules}
      scriptId={scriptId}
      entryFunction={entryFunction || hooksToFunctionNamesMap.filter}
      insertStubKey="filter"
      onClose={onClose}
      optionalSaveParams={optionalSaveParams}
      flowId={flowId}
      isSampleDataLoading={sampleDataStatus === 'requested'}
      path="outputFilter"
    />
  );
}

function OutputFilter(props) {
  const { open } = props;

  return <>{open && <OutputFilterDrawer {...props} />}</>;
}

export default {
  // used to create data-test attribute and component key. Should be unique across FB actions.
  name: 'outputFilter',
  position: 'middle',
  Icon,
  helpKey: 'fb.pp.exports.filter',
  Component: OutputFilter,
};
