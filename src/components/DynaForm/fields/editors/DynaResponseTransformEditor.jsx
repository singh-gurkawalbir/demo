import { useState, Fragment, useMemo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import actions from '../../../../actions';
import TransformToggleEditorDialog from '../../../AFE/TransformEditor/TransformToggleEditorDialog';
import { hooksToFunctionNamesMap } from '../../../../utils/hooks';

export default function DynaResponseTransformEditor(props) {
  const {
    id,
    label,
    resourceId,
    onFieldChange,
    value,
    disabled,
    options = {},
  } = props;
  const [showEditor, setShowEditor] = useState(false);
  const dispatch = useDispatch();
  const handleEditorClick = () => {
    setShowEditor(!showEditor);
  };

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
    (shouldCommit, editorValues) => {
      if (shouldCommit) {
        const responseTransformData = constructTransformData(editorValues);

        if (responseTransformData.type === 'script') {
          saveScript(editorValues);
        }

        onFieldChange(id, responseTransformData);
      }

      setShowEditor(false);
    },
    [id, onFieldChange, saveScript]
  );
  // when we launch the editor we are only going to entertain the first
  // rule set
  const { type, rule, scriptId, entryFunction } = useMemo(() => {
    const { type, script = {}, expression = {} } = value || {};

    return {
      type,
      rule: expression.rules && expression.rules[0],
      scriptId: script._scriptId,
      entryFunction: script.function,
    };
  }, [value]);

  // We are deliberately concat the id and resourceId, in order to create
  // a more unique key for the transform editor launch per resource. This will
  // cause react to shake the component tree to perform a rerender and the
  // rule elements key would use just the row index.
  return (
    <Fragment>
      {showEditor && (
        <TransformToggleEditorDialog
          title="Transform record"
          id={id + resourceId}
          disabled={disabled}
          data={options.sampleResponseData}
          type={type}
          scriptId={scriptId}
          rule={rule}
          entryFunction={entryFunction || hooksToFunctionNamesMap.transform}
          insertStubKey="transform"
          onClose={handleClose}
        />
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={handleEditorClick}
        data-test={id}>
        {label}
      </Button>
    </Fragment>
  );
}
