import React from 'react';
import EditorDrawer from '../EditorDrawer';
import TransformEditor from '.';

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
