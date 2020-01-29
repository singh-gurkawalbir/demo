import { useEffect, useMemo, useCallback } from 'react';
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
  const sampleData = useSelector(state =>
    selectors.getSampleData(state, {
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
  const saveScript = useCallback(
    values => {
      const { code, scriptId } = values;
      const patchSet = [
        {
          op: 'replace',
          path: '/content',
          value: code,
        },
      ];

      dispatch(actions.resource.patchStaged(scriptId, patchSet, 'value'));
      dispatch(actions.resource.commitStaged('scripts', scriptId, 'value'));
    },
    [dispatch]
  );
  const saveTransformRules = useCallback(
    values => {
      const { processor, rule, scriptId, entryFunction } = values;
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
    },
    [dispatch, exportId]
  );
  const handleClose = useCallback(
    (shouldCommit, editorValues) => {
      if (shouldCommit) {
        const transformType =
          editorValues.processor === 'transform' ? 'expression' : 'script';

        if (transformType === 'script') {
          // Incase of script type, save script changes
          saveScript(editorValues);
        }

        // save transform rules
        saveTransformRules(editorValues);
      }

      onClose();
    },
    [onClose, saveScript, saveTransformRules]
  );

  useEffect(() => {
    if (!sampleData) {
      dispatch(
        actions.flowData.requestSampleData(
          flowId,
          exportId,
          'exports',
          'transform'
        )
      );
    }
  }, [dispatch, flowId, exportId, sampleData]);

  return (
    <TransformToggleEditorDialog
      title="Transform Record"
      id={exportId}
      disabled={isViewMode}
      data={sampleData}
      type={type}
      scriptId={scriptId}
      rule={rule}
      entryFunction={entryFunction || hooksToFunctionNamesMap.transform}
      insertStubKey="transform"
      onClose={handleClose}
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
