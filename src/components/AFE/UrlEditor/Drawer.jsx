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
    ...rest
  } = props;

  return (
    <AFE2EditorDrawer
      id={id}
      {...rest}
      disabled={disabled}
      showFullScreen>
      <UrlEditor
        lookups={lookups}
        disabled={disabled}
        // editorId={id}
        rule={rule}
        data={data}
        isSampleDataLoading={isSampleDataLoading}
      />
    </AFE2EditorDrawer>
  );
}
