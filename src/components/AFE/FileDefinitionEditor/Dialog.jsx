import React from 'react';
import EditorDialog from '../EditorDialog';
import FileDefinitionEditor from './index';

function FileDefinitionEditorDialog(props) {
  const { id, rule, data, ...rest } = props;
  const defaults = {
    width: '80vw',
    layout: 'column',
    height: '50vh',
    open: true,
  };

  return (
    <EditorDialog id={id} {...defaults} {...rest}>
      <FileDefinitionEditor editorId={id} rule={rule} data={data} />
    </EditorDialog>
  );
}

export default FileDefinitionEditorDialog;
