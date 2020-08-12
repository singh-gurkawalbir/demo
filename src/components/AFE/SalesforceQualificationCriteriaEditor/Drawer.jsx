import React from 'react';
import EditorDrawer from '../EditorDrawer';
import DynaSalesforceQualificationCriteria from '../../DynaForm/fields/DynaSalesforceRealtimeQualifier';

export default function SalesforceQualificationCriteriaEditorDrawer(props) {
  const { id } = props;

  return (
    <EditorDrawer
      {...props}
      showFullScreen
      showLayoutOptions={false}
      hidePreviewAction>
      <DynaSalesforceQualificationCriteria editorId={id} {...props} />
    </EditorDrawer>
  );
}
