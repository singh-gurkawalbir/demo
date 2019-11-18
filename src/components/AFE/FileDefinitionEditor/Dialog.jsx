import React from 'react';
import EditorDialog from '../EditorDialog';
import FileDefinitionEditor from './index';

function FileDefinitionEditorDialog(props) {
  const {
    id,
    rule,
    data,
    disabled,
    processor = 'structuredFileParser',
    ...rest
  } = props;
  const defaults = {
    width: '80vw',
    layout: 'column',
    height: '50vh',
    open: true,
  };

  return (
    <EditorDialog id={id} {...defaults} disabled={disabled} {...rest}>
      <FileDefinitionEditor
        editorId={id}
        rule={rule}
        data={data}
        processor={processor}
        disabled={disabled}
      />
    </EditorDialog>
  );
}

export default FileDefinitionEditorDialog;
