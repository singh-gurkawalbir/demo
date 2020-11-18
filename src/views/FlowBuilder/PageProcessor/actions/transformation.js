import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import Icon from '../../../../components/icons/TransformIcon';
import TransformEditorDrawer from '../../../../components/AFE/TransformEditor/TransformToggleEditorDrawer';
import { hooksToFunctionNamesMap } from '../../../../utils/hooks';

function TransformationDrawer({ flowId, resource, isViewMode, onClose }) {
  const dispatch = useDispatch();
  const exportId = resource._id;
  const resourceType = 'exports';
  const { status: sampleDataStatus, data: sampleData } = useSelector(state =>
    selectors.sampleDataWrapper(state, {
      flowId,
      resourceId: exportId,
      resourceType,
      stage: 'transform',
    })
  );
  const { type, rule, scriptId, entryFunction } = useMemo(() => {
    const transformObj = (resource && resource.transform) || {};
    const { type, script = {}, expression = {} } = transformObj;

    return {
      type,
      rule: expression.rules && expression.rules[0],
      scriptId: script._scriptId,
      entryFunction: script.function,
    };
  }, [resource]);

  useEffect(() => {
    if (!sampleDataStatus) {
      dispatch(
        actions.flowData.requestSampleData(
          flowId,
          exportId,
          resourceType,
          'transform'
        )
      );
    }
  }, [dispatch, exportId, flowId, sampleDataStatus]);

  const optionalSaveParams = useMemo(
    () => ({
      processorKey: 'transform',
      resourceId: exportId,
      resourceType: 'exports',
    }),
    [exportId]
  );

  return (
    <TransformEditorDrawer
      title="Define transformation"
      helpKey="export.transform.rules"
      helpTitle="Transform rules"
      id={exportId}
      disabled={isViewMode}
      data={sampleData}
      type={type}
      scriptId={scriptId}
      rule={rule}
      entryFunction={entryFunction || hooksToFunctionNamesMap.transform}
      insertStubKey="transform"
      onClose={onClose}
      optionalSaveParams={optionalSaveParams}
      isSampleDataLoading={sampleDataStatus === 'requested'}
      path="lookupTransformation"
    />
  );
}

function Transformation(props) {
  const { open } = props;

  return <>{open && <TransformationDrawer {...props} />}</>;
}

export default {
  // used to create data-test attribute and component key. Should be unique across FB actions.
  name: 'lookupTransformation',
  position: 'middle',
  Icon,
  helpKey: 'fb.pp.exports.transform',
  Component: Transformation,
};
