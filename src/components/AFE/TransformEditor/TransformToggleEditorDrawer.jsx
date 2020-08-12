import React, { useState, useMemo, useCallback } from 'react';
import EditorDrawer from '../EditorDrawer';
import TransformEditor from '.';
import JavaScriptEditor from '../JavaScriptEditor';
import TextToggle from '../../TextToggle';

const toggleEditorOptions = [
  { label: 'Rules', value: 'expression' },
  { label: 'JavaScript', value: 'script' },
];

export default function TransformToggleEditorDrawer({
  id,
  type,
  rule,
  scriptId,
  data,
  disabled,
  entryFunction,
  insertStubKey,
  optionalSaveParams,
  isSampleDataLoading,
  ...rest
}) {
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
      disabled={disabled}
      toggleAction={editorToggleAction}
      activeEditorIndex={activeEditorIndex}
      patchOnSave
      showLayoutOptions>
      <TransformEditor
        rule={rule}
        data={data && JSON.stringify(data.record, null, 2)}
        disabled={disabled}
        optionalSaveParams={optionalSaveParams}
        isSampleDataLoading={isSampleDataLoading}
      />
      <JavaScriptEditor
        data={JSON.stringify(data, null, 2)}
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
