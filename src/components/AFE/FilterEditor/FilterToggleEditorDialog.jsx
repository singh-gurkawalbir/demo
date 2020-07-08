import React from 'react';
import ToggleEditorDialog from '../EditorDialog/toggleEditorDialog';
import FilterEditor from './index';
import JavaScriptEditor from '../JavaScriptEditor';

export default function FilterToggleEditorDialog(props) {
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
    ...rest
  } = props;
  const defaults = {
    width: '85vw',
    height: '60vh',
    layout: 'compact',
    open: true,
    labels: ['Rules', 'JavaScript'],
  };

  return (
    <ToggleEditorDialog
      id={id}
      type={type}
      {...defaults}
      {...rest}
      disabled={disabled}
      showLayoutOptions>
      <FilterEditor
        disabled={disabled}
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
    </ToggleEditorDialog>
  );
}
