import { useEffect, Fragment, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import Icon from '../../../../components/icons/TransformIcon';
import TransformEditorDialog from '../../../../components/AFE/TransformEditor/TransformToggleEditorDialog';
import helpTextMap from '../../../../components/Help/helpTextMap';

function TransformationDialog({ flowId, resource, isViewMode, onClose }) {
  const dispatch = useDispatch();
  const exportId = resource._id;
  const resourceType = 'exports';
  const sampleData = useSelector(state =>
    selectors.getSampleData(state, {
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
  const handleClose = useCallback(
    (shouldCommit, editorValues) => {
      if (shouldCommit) {
        const { processor, rule, scriptId, entryFunction } = editorValues;
        const type = processor === 'transform' ? 'expression' : 'script';
        const path = '/transform';
        const value = {
          type,
          expression: {
            version: 1,
            rules: rule ? [rule] : [[]],
          },
          script: {
            _scriptId: scriptId,
            function: entryFunction,
          },
        };
        const patchSet = [{ op: 'replace', path, value }];

        // Save the resource
        dispatch(actions.resource.patchStaged(exportId, patchSet, 'value'));
        dispatch(actions.resource.commitStaged('exports', exportId, 'value'));
      }

      onClose();
    },
    [dispatch, exportId, onClose]
  );

  useEffect(() => {
    if (!sampleData) {
      dispatch(
        actions.flowData.requestSampleData(
          flowId,
          exportId,
          resourceType,
          'transform'
        )
      );
    }
  }, [dispatch, exportId, flowId, sampleData]);

  return (
    <TransformEditorDialog
      title="Transform Mapping"
      id={exportId}
      disabled={isViewMode}
      data={sampleData}
      type={type}
      scriptId={scriptId}
      rule={rule}
      entryFunction={entryFunction}
      insertStubKey="transform"
      onClose={handleClose}
    />
  );
}

function Transformation(props) {
  const { open } = props;

  return <Fragment>{open && <TransformationDialog {...props} />}</Fragment>;
}

export default {
  // used to create data-test attribute and component key. Should be unique across FB actions.
  name: 'lookupTransformation',
  position: 'middle',
  Icon,
  helpText: helpTextMap['fb.pp.exports.transform'],
  Component: Transformation,
};
