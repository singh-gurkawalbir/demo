import React, { useState, useCallback, useMemo, useEffect} from 'react';
import { useDispatch } from 'react-redux';
import EditorDrawer from '../../../AFE/EditorDrawer/new';
import TextToggle from '../../../TextToggle';
import actions from '../../../../actions';
import Editor from '../index';

const toggleEditorOptions = [
  { label: 'Rules', value: 'expression' },
  { label: 'JavaScript', value: 'script' },
];

export default function FilterToggleEditorDrawer(props) {
  const {
    id,
    flowId,
    resourceType,
    rule,
    scriptId,
    data,
    disabled,
    type,
    entryFunction,
    insertStubKey,
    optionalSaveParams,
    isSampleDataLoading,
    isMonitorLevelAccess,
    enableFilterForIA,
    onClose,
    resultMode,
    ...rest
  } = props;
  const dispatch = useDispatch();
  const [activeEditorIndex, setActiveEditorIndex] = useState('0');
  const handleEditorToggle = useCallback(
    value =>
      setActiveEditorIndex(value === 'expression' ? '0' : '1'),
    [setActiveEditorIndex]
  );
  const handleCloseEditor = useCallback(
    () => {
      // remove both editors from the state when the drawer is closed
      dispatch(actions._editor.clear(`${id}-0`));
      dispatch(actions._editor.clear(`${id}-1`));
      if (onClose) {
        onClose();
      }
    },
    [dispatch, id, onClose]
  );
  const editorToggleAction = useMemo(() => (
    <TextToggle
      disabled={disabled}
      value={activeEditorIndex === '0' ? 'expression' : 'script'}
      onChange={handleEditorToggle}
      exclusive
      options={toggleEditorOptions}
          />
  ), [activeEditorIndex, disabled, handleEditorToggle]);

  useEffect(() => {
    dispatch(
      actions._editor.init(`${id}-0`, 'filter', {
        rule: props.rule,
        flowId,
        resourceId: id,
        resourceType,
        stage: 'outputFilter',
        // optionalSaveParams,
        // // special: {
        // //   optionalSaveParams,
        // // },
      })
    );

    dispatch(
      actions._editor.init(`${id}-1`, 'javascript', {
        rule: {
          scriptId,
          entryFunction: entryFunction || 'main',
        },
        resultMode,
        flowId,
        resourceId: id,
        resourceType,
        stage: 'outputFilter',
        // context,
        // optionalSaveParams,
      })
    );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <EditorDrawer
      id={id}
      type={type}
      {...rest}
      disabled={enableFilterForIA ? isMonitorLevelAccess : disabled}
      onClose={handleCloseEditor}
      toggleAction={editorToggleAction}
      activeEditorIndex={activeEditorIndex}
      patchOnSave
      showLayoutOptions>
      <Editor
        insertStubKey={insertStubKey}
        // TODO: disabled is diff for filter vs JS editor
        disabled={enableFilterForIA ? isMonitorLevelAccess : disabled}
      />
    </EditorDrawer>
  );
}
