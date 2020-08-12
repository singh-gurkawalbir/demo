import React from 'react';
import EditorDrawer from '../EditorDrawer';
import DynaNetSuiteLookupFilters from '../../DynaForm/fields/DynaNetSuiteLookupFilters';

export default function NetSuiteLookupFilterEditorDrawer(props) {
  const { id } = props;

  return (
    <EditorDrawer
      {...props}
      showFullScreen
      showLayoutOptions={false}
      hidePreviewAction>
      <DynaNetSuiteLookupFilters editorId={id} {...props} />
    </EditorDrawer>
  );
}
