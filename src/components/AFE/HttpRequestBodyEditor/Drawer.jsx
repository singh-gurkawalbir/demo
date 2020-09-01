import React from 'react';
import HttpRequestBodyEditor from '.';
import AFE2EditorDrawer from '../AFE2Editor/Drawer';

export default function HttpRequestBodyDrawer(props) {
  const {
    id,
    rule,
    data,
    contentType,
    lookups = [],
    disabled,
    isSampleDataLoading,
    editorVersion,
    ...rest
  } = props;

  return (
    <AFE2EditorDrawer
      id={id}
      {...rest}
      disabled={disabled}
      editorVersion={editorVersion}>
      <HttpRequestBodyEditor
        contentType={contentType}
        editorVersion={editorVersion}
        lookups={lookups}
        rule={rule}
        data={data}
        isSampleDataLoading={isSampleDataLoading}
        disabled={disabled}
      />
    </AFE2EditorDrawer>
  );
}
