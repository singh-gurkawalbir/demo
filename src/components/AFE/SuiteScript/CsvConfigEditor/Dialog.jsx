import React from 'react';
import EditorDialog from './EditorDialog';
import CsvParseEditor from './CsvParser';

export default function CsvConfigEditorDialog(props) {
  // csvEditorType: ['parse', 'generate']
  const { id, rule, data, disabled, editorDataTitle, ...rest } = props;
  const defaults = {
    width: '80vw',
    height: '70vh',
    open: true,
  };

  return (
    <EditorDialog
      id={id}
      {...defaults}
      {...rest}
      showLayoutOptions={false}
      disabled={disabled}
      showFullScreen>
      <CsvParseEditor
        disabled={disabled}
        editorId={id}
        rule={rule}
        data={data}
        editorDataTitle={editorDataTitle}

      />
    </EditorDialog>
  );
}
