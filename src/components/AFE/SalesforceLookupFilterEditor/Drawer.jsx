import React from 'react';
import EditorDrawer from '../EditorDrawer';
import DynaSalesforceLookupFilters from '../../DynaForm/fields/DynaSalesforceLookupFilters';

export default function SalesforceLookupFilterEditorDrawer(props) {
  const { id } = props;

  return (
    <EditorDrawer
      {...props}
      showFullScreen
      showLayoutOptions={false}
      hidePreviewAction>
      <DynaSalesforceLookupFilters editorId={id} {...props} />
    </EditorDrawer>
  );
}
