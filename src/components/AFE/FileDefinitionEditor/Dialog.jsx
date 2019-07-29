import React from 'react';
import EditorDialog from '../EditorDialog';
import FileDefinitionEditor from './index';

function FileDefinitionEditorDialog(props) {
  const defaults = {
    layout: 'column',
    width: '80vw',
    height: '50vh',
    open: true,
  };
  const { id, rule, data, ...rest } = props;

  return (
    <EditorDialog id={id} {...defaults} {...rest}>
      <FileDefinitionEditor editorId={id} rule={rule} data={data} />
    </EditorDialog>
  );
}

export default FileDefinitionEditorDialog;
