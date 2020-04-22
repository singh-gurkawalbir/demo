import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import Icon from '../../../../components/icons/TransformIcon';
import TransformToggleEditorDialog from '../../../../components/AFE/TransformEditor/TransformToggleEditorDialog';
import helpTextMap from '../../../../components/Help/helpTextMap';
import { hooksToFunctionNamesMap } from '../../../../utils/hooks';

function TransformationDialog({ flowId, resource, onClose, isViewMode }) {
  const dispatch = useDispatch();
  const exportId = resource._id;
  const { status: sampleDataStatus, data: sampleData } = useSelector(state =>
    selectors.getSampleDataWrapper(state, {
      flowId,
      resourceId: exportId,
      resourceType: 'exports',
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
          'exports',
          'transform'
        )
      );
    }
  }, [dispatch, flowId, exportId, sampleDataStatus]);

  const optionalSaveParams = useMemo(
    () => ({
      processorKey: 'transform',
      resourceId: exportId,
      resourceType: 'exports',
    }),
    [exportId]
  );

  return (
    <TransformToggleEditorDialog
      title="Transform response"
      helpKey="export.transform.rules"
      helpTitle="Transform record"
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
    />
  );
}

function Transformation(props) {
  if (!props.open) return null;

  return <TransformationDialog {...props} />;
}

export default {
  // used to create data-test attribute and component key. Should be unique across FB actions.
  name: 'exportTransformation',
  position: 'right',
  Icon,
  helpText: helpTextMap['fb.pg.exports.transform'],
  Component: Transformation,
};
