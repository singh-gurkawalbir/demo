import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import Icon from '../../../../components/icons/InputFilterIcon';
import InputFilterToggleEditorDialog from '../../../../components/AFE/FilterEditor/FilterToggleEditorDialog';
import { hooksToFunctionNamesMap } from '../../../../utils/hooks';

function InputFilterDialog({
  flowId,
  resource,
  resourceType,
  isViewMode,
  onClose,
}) {
  const dispatch = useDispatch();
  const resourceId = resource._id;
  const { status: sampleDataStatus, data: sampleData } = useSelector(state =>
    selectors.getSampleDataWrapper(state, {
      flowId,
      resourceId,
      resourceType,
      stage: 'inputFilter',
    })
  );
  const { type, rules, scriptId, entryFunction } = useMemo(() => {
    const filterObj =
      resource &&
      (resourceType === 'imports' ? resource.filter : resource.inputFilter);
    const { type, script = {}, expression = {} } = filterObj || {};

    return {
      type,
      rules: expression.rules || [],
      scriptId: script._scriptId,
      entryFunction: script.function,
    };
  }, [resource, resourceType]);
  const helpKey =
    resourceType === 'imports' ? 'import.filter.rules' : 'lookup.input.filter';

  useEffect(() => {
    if (!sampleDataStatus) {
      dispatch(
        actions.flowData.requestSampleData(
          flowId,
          resourceId,
          resourceType,
          'inputFilter'
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
      processorKey: 'inputFilter',
      resourceId,
      resourceType,
      rules,
    }),
    [resourceId, resourceType, rules]
  );

  return (
    <InputFilterToggleEditorDialog
      title="Define input filter"
      helpTitle="Filter Rules"
      helpKey={helpKey}
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
      flowId={flowId}
    />
  );
}

function InputFilter(props) {
  const { open } = props;

  return <>{open && <InputFilterDialog {...props} />}</>;
}

export default {
  // used to create data-test attribute and component key. Should be unique across FB actions.
  name: 'inputFilter',
  position: 'left',
  Icon,
  helpText:
    'This is the text currently in the hover state of actions in the current FB',
  Component: InputFilter,
};
