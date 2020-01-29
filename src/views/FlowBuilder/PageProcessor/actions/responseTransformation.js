import { Fragment, useMemo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../actions';
import Icon from '../../../../components/icons/TransformIcon';
import helpTextMap from '../../../../components/Help/helpTextMap';
import TransformToggleEditorDialog from '../../../../components/AFE/TransformEditor/TransformToggleEditorDialog';
import { hooksToFunctionNamesMap } from '../../../../utils/hooks';

function ResponseTransformationDialog(props) {
  const dispatch = useDispatch();
  const { onClose, resource, isViewMode } = props;
  const resourceId = resource._id;
  const { sampleResponseData, responseTransform } = resource;
  const { type, rule, scriptId, entryFunction } = useMemo(() => {
    const { type, script = {}, expression = {} } = responseTransform || {};

    return {
      type,
      rule: expression.rules && expression.rules[0],
      scriptId: script._scriptId,
      entryFunction: script.function,
    };
  }, [responseTransform]);
  const saveResponseTransform = useCallback(
    formValues => {
      const { sampleResponseData, responseTransform } = formValues;
      const patchSet = [];

      patchSet.push(
        {
          op: 'replace',
          path: '/sampleResponseData',
          value: sampleResponseData,
        },
        {
          op: 'replace',
          path: '/responseTransform',
          value: responseTransform,
        }
      );
      // Save the resource
      dispatch(actions.resource.patchStaged(resourceId, patchSet, 'value'));
      dispatch(actions.resource.commitStaged('imports', resourceId, 'value'));
    },
    [dispatch, resourceId]
  );
  /*
   * Creates transform rules as per required format to be saved
   */
  const constructTransformData = values => {
    const { processor, rule, scriptId, entryFunction } = values;
    const type = processor === 'transform' ? 'expression' : 'script';

    return {
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
  };

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
  const handleClose = useCallback(
    (shouldCommit, editorValues = {}) => {
      if (shouldCommit) {
        const responseTransformData = constructTransformData(editorValues);
        const sampleResponseData = editorValues.data;

        if (responseTransformData.type === 'script') {
          saveScript(editorValues);
        }

        saveResponseTransform({
          sampleResponseData,
          responseTransform: responseTransformData,
        });
      }

      // Closes Editor
      onClose();
    },
    [onClose, saveResponseTransform, saveScript]
  );

  return (
    <TransformToggleEditorDialog
      title="Transform record"
      id={resourceId}
      disabled={isViewMode}
      data={sampleResponseData}
      type={type}
      scriptId={scriptId}
      rule={rule}
      entryFunction={entryFunction || hooksToFunctionNamesMap.transform}
      insertStubKey="transform"
      onClose={handleClose}
    />
  );
}

function ResponseTransformation(props) {
  const { open } = props;

  return (
    <Fragment>{open && <ResponseTransformationDialog {...props} />}</Fragment>
  );
}

export default {
  // used to create data-test attribute and component key. Should be unique across FB actions.
  name: 'responseTransformation',
  position: 'middle',
  Icon,
  helpText: helpTextMap['fb.pp.imports.transform'],
  Component: ResponseTransformation,
};
