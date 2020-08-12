import React from 'react';
import EditorDrawer from '../EditorDrawer';
import MergeEditor from '.';

export default function MergeEditorDrawer(props) {
  const { id, rule, data, disabled, ...rest } = props;

  return (
    <EditorDrawer
      id={id}
      {...rest}
      disabled={disabled}
      showFullScreen>
      <MergeEditor editorId={id} rule={rule} data={data} disabled={disabled} />
    </EditorDrawer>
  );
}
