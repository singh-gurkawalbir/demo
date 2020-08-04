import React from 'react';
import EditorDrawer from '../EditorDrawer';
import DynaNetSuiteQualificationCriteria from '../../DynaForm/fields/DynaNetSuiteQualificationCriteria';

export default function NetSuiteQualificationCriteriaEditorDrawer(props) {
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
      <DynaNetSuiteQualificationCriteria editorId={id} {...props} />
    </EditorDrawer>
  );
}
