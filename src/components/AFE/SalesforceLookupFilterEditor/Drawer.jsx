import React from 'react';
import EditorDrawer from '../EditorDrawer';
import DynaSalesforceLookupFilters from '../../DynaForm/fields/DynaSalesforceLookupFilters';

export default function SalesforceLookupFilterEditorDrawer(props) {
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
      <DynaSalesforceLookupFilters editorId={id} {...props} />
    </EditorDrawer>
  );
}
