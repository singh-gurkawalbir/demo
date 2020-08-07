import React from 'react';
import EditorDrawer from '../EditorDrawer';
import FileDefinitionEditor from './index';

const defaults = {
  width: '80vw',
  layout: 'compact',
  height: '50vh',
  open: true,
};

function FileDefinitionEditorDrawer(props) {
  const {
    id,
    rule,
    data,
    disabled,
    processor = 'structuredFileParser',
    ...rest
  } = props;

  return (
    <EditorDrawer id={id} {...defaults} disabled={disabled} {...rest}>
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

export default FileDefinitionEditorDrawer;
