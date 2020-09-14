import React from 'react';
import UrlEditor from '.';
import AFE2EditorDrawer from '../AFE2Editor/Drawer';

export default function UrlEditorDrawer(props) {
  const {
    id,
    isSampleDataLoading,
    rule,
    lookups = [],
    data,
    disabled,
    editorVersion,
    ...rest
  } = props;

  return (
    <AFE2EditorDrawer
      id={id}
      editorVersion={editorVersion}
      {...rest}
      disabled={disabled}
      showFullScreen>
      <UrlEditor
        lookups={lookups}
        disabled={disabled}
        editorVersion={editorVersion}
        rule={rule}
        data={data}
        isSampleDataLoading={isSampleDataLoading}
      />
    </AFE2EditorDrawer>
  );
}
