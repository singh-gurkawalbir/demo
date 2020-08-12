import React from 'react';
import EditorDrawer from '../EditorDrawer';
import XmlParseEditor from '.';

export default function XmlParseEditorDrawer(props) {
  const { id, rule, data, editorDataTitle, disabled, ...rest } = props;

  return (
    <EditorDrawer
      id={id}
      {...rest}
      showLayoutOptions={false}
      disabled={disabled}
      showFullScreen>
      <XmlParseEditor
        disabled={disabled}
        editorId={id}
        rule={rule}
        data={data}
        editorDataTitle={editorDataTitle}
      />
    </EditorDrawer>
  );
}
