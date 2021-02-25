import React from 'react';
import EditorDrawer from '../EditorDrawer';
import FileDefinitionEditor from './index';

export default function FileDefinitionEditorDrawer(props) {
  const {
    id,
    rule,
    data,
    disabled,
    processor = 'structuredFileParser',
    ...rest
  } = props;

  return (
    <EditorDrawer id={id} disabled={disabled} {...rest}>
      <FileDefinitionEditor
        editorId={id}
        rule={rule}
        data={data}
        processor={processor}
        disabled={disabled}
      />
    </EditorDrawer>
  );
}
