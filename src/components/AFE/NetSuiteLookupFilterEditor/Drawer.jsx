import React from 'react';
import EditorDrawer from '../EditorDrawer';
import DynaNetSuiteLookupFilters from '../../DynaForm/fields/DynaNetSuiteLookupFilters';

export default function NetSuiteLookupFilterEditorDrawer(props) {
  const { id } = props;
  const defaults = {
    layout: 'compact',
    width: '70vw',
    height: '55vh',
    open: true,
  };

  return (
    <EditorDrawer
      {...defaults}
      {...props}
      showFullScreen
      showLayoutOptions={false}
      hidePreviewAction>
      <DynaNetSuiteLookupFilters editorId={id} {...props} />
    </EditorDrawer>
  );
}
