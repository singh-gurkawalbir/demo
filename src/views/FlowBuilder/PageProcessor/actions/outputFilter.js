import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import Icon from '../../../../components/icons/OutputFilterIcon';
import helpTextMap from '../../../../components/Help/helpTextMap';
import OutputFilterToggleEditorDialog from '../../../../components/AFE/FilterEditor/FilterToggleEditorDialog';
import { hooksToFunctionNamesMap } from '../../../../utils/hooks';

function OutputFilterDialog({
  flowId,
  resource,
  isViewMode,
  resourceType,
  onClose,
}) {
  const dispatch = useDispatch();
  const resourceId = resource._id;
  const { status: sampleDataStatus, data: sampleData } = useSelector(state =>
    selectors.getSampleDataWrapper(state, {
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
    <OutputFilterToggleEditorDialog
      title="Define output filter"
      helpKey="lookup.output.filter"
      helpTitle="Filter Rules"
      disabled={isViewMode}
      id={resourceId + flowId}
      data={sampleData}
      type={type}
      rule={rules}
      scriptId={scriptId}
      entryFunction={entryFunction || hooksToFunctionNamesMap.filter}
      insertStubKey="filter"
      onClose={onClose}
      optionalSaveParams={optionalSaveParams}
    />
  );
}

function OutputFilter(props) {
  const { open } = props;

  return <>{open && <OutputFilterDialog {...props} />}</>;
}

export default {
  // used to create data-test attribute and component key. Should be unique across FB actions.
  name: 'outputFilter',
  position: 'middle',
  Icon,
  helpText: helpTextMap['fb.pp.exports.filter'],
  Component: OutputFilter,
};
