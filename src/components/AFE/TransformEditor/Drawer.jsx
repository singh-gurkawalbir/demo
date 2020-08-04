import React from 'react';
import EditorDrawer from '../EditorDrawer';
import TransformEditor from '.';

const defaults = {
  width: '85vw',
  height: '60vh',
  layout: 'compact',
  open: true,
};

export default function TransformEditorDrawer({
  id,
  rule,
  data,
  disabled,
  ...rest
}) {
  return (
    <EditorDrawer
      id={id}
      {...defaults}
      {...rest}
      disabled={disabled}
      showLayoutOptions={false}>
      <TransformEditor
        editorId={id}
        rule={rule}
        data={data}
        disabled={disabled}
      />
    </EditorDrawer>
  );
}
