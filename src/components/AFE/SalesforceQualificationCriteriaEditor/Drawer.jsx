import React from 'react';
import EditorDrawer from '../EditorDrawer';
import DynaSalesforceQualificationCriteria from '../../DynaForm/fields/DynaSalesforceRealtimeQualifier';

export default function SalesforceQualificationCriteriaEditorDrawer(props) {
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
      <DynaSalesforceQualificationCriteria editorId={id} {...props} />
    </EditorDrawer>
  );
}
