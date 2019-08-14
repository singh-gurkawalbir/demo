import React from 'react';
import EditorDialog from '../EditorDialog';
import FileDefinitionEditor from './index';

function FileDefinitionEditorDialog(props) {
  const {
    id,
    rule,
    data,
    title,
    onClose,
    open = true,
    layout = 'column',
    width = '80vw',
    height = '50vh',
  } = props;

  return (
    <EditorDialog
      id={id}
      open={open}
      title={title}
      width={width}
      layout={layout}
      height={height}
      onClose={onClose}>
      <FileDefinitionEditor editorId={id} rule={rule} data={data} />
    </EditorDialog>
  );
}

export default FileDefinitionEditorDialog;
