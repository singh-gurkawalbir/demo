import React from 'react';
import EditorDrawer from '../EditorDrawer';
import DynaNetSuiteQualificationCriteria from '../../DynaForm/fields/DynaNetSuiteQualificationCriteria';

export default function NetSuiteQualificationCriteriaEditorDrawer(props) {
  const { id } = props;

  return (
    <EditorDrawer
      {...props}
      showFullScreen
      showLayoutOptions={false}
      hidePreviewAction>
      <DynaNetSuiteQualificationCriteria editorId={id} {...props} />
    </EditorDrawer>
  );
}
