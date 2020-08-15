import React, { useState, useCallback, useMemo} from 'react';
import EditorDrawer from '../EditorDrawer';
import FilterEditor from './index';
import JavaScriptEditor from '../JavaScriptEditor';
import TextToggle from '../../TextToggle';

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
    ...rest
  } = props;

  const [activeEditorIndex, setActiveEditorIndex] = useState('0');
  const handleEditorToggle = useCallback(
    value =>
      setActiveEditorIndex(value === 'expression' ? '0' : '1'),
    [setActiveEditorIndex]
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

  return (
    <EditorDrawer
      id={id}
      type={type}
      {...rest}
      disabled={enableFilterForIA ? isMonitorLevelAccess : disabled}
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
      />
      <JavaScriptEditor
        data={data}
        disabled={disabled}
        scriptId={scriptId}
        entryFunction={entryFunction}
        insertStubKey={insertStubKey}
        optionalSaveParams={optionalSaveParams}
        isSampleDataLoading={isSampleDataLoading}
      />
    </EditorDrawer>
  );
}
