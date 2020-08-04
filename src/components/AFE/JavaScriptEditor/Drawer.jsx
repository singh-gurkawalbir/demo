import React from 'react';
import EditorDrawer from '../EditorDrawer';
import JavaScriptEditor from '.';

export default function JavaScriptEditorDrawer(props) {
  const {
    id,
    rule,
    data,
    scriptId,
    disabled,
    entryFunction,
    context,
    insertStubKey,
    optionalSaveParams,
    resultMode,
    isSampleDataLoading,
    ...rest
  } = props;
  const defaults = {
    width: '80vw',
    height: '50vh',
    open: true,
  };

  return (
    <EditorDrawer
      id={id}
      {...defaults}
      {...rest}
      showLayoutOptions={false}
      disabled={disabled}>
      <JavaScriptEditor
        editorId={id}
        scriptId={scriptId}
        entryFunction={entryFunction}
        context={context}
        insertStubKey={insertStubKey}
        data={data}
        disabled={disabled}
        resultMode={resultMode}
        optionalSaveParams={optionalSaveParams}
        isSampleDataLoading={isSampleDataLoading}
      />
    </EditorDrawer>
  );
}
