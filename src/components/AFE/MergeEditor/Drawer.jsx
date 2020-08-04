import React from 'react';
import EditorDrawer from '../EditorDrawer';
import MergeEditor from '.';

export default function MergeEditorDrawer(props) {
  const { id, rule, data, disabled, ...rest } = props;
  const defaults = {
    layout: 'compact',
    width: '80vw',
    height: '50vh',
    open: true,
  };

  return (
    <EditorDrawer
      id={id}
      {...defaults}
      {...rest}
      disabled={disabled}
      showFullScreen>
      <MergeEditor editorId={id} rule={rule} data={data} disabled={disabled} />
    </EditorDrawer>
  );
}
