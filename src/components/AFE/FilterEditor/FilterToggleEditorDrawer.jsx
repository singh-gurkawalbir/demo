import React, { useState, useCallback, useMemo} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EditorDrawer from '../EditorDrawer';
import FilterEditor from './index';
import JavaScriptEditor from '../JavaScriptEditor';
import TextToggle from '../../TextToggle';
import actions from '../../../actions';
import { selectors } from '../../../reducers';

const toggleEditorOptions = [
  { label: 'Rules', value: 'expression' },
  { label: 'JavaScript', value: 'script' },
];

export default function FilterToggleEditorDrawer(props) {
  const {
    id,
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
    ...rest
  } = props;
  const dispatch = useDispatch();
  const [activeEditorIndex, setActiveEditorIndex] = useState('0');
  const handleEditorToggle = useCallback(
    value =>
      setActiveEditorIndex(value === 'expression' ? '0' : '1'),
    [setActiveEditorIndex]
  );
  const saveInProgress = useSelector(
    state => selectors.editorPatchStatus(state, `${id}-0`).saveInProgress ||
      selectors.editorPatchStatus(state, `${id}-1`).saveInProgress
  );

  const handleCloseEditor = useCallback(
    () => {
      // remove both editors from the state when the drawer is closed
      dispatch(actions.editor.clear(`${id}-0`));
      dispatch(actions.editor.clear(`${id}-1`));
      if (onClose) {
        onClose();
      }
    },
    [dispatch, id, onClose]
  );
  const editorToggleAction = useMemo(() => (
    <TextToggle
      disabled={disabled || saveInProgress}
      value={activeEditorIndex === '0' ? 'expression' : 'script'}
      onChange={handleEditorToggle}
      exclusive
      options={toggleEditorOptions}
          />
  ), [activeEditorIndex, disabled, handleEditorToggle, saveInProgress]);

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
      <FilterEditor
        disabled={enableFilterForIA ? isMonitorLevelAccess : disabled}
        data={data}
        rule={rule}
        optionalSaveParams={optionalSaveParams}
        isSampleDataLoading={isSampleDataLoading}
        isToggleScreen
      />
      <JavaScriptEditor
        data={data}
        disabled={disabled}
        scriptId={scriptId}
        entryFunction={entryFunction}
        insertStubKey={insertStubKey}
        optionalSaveParams={optionalSaveParams}
        isSampleDataLoading={isSampleDataLoading}
        isToggleScreen
      />
    </EditorDrawer>
  );
}
