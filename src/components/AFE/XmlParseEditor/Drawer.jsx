import React from 'react';
import EditorDrawer from '../EditorDrawer';
import XmlParseEditor from '.';

export default function XmlParseEditorDrawer(props) {
  const { id, rule, data, editorDataTitle, disabled, ...rest } = props;
  const defaults = {
    width: '80vw',
    height: '70vh',
    open: true,
  };

  return (
    <EditorDrawer
      id={id}
      {...defaults}
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
