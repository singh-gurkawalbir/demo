import React from 'react';
import CsvParseEditor from './CsvParser';
import CsvGenerateEditor from './CsvGenerator';
import AFE2EditorDialog from '../AFE2EditorDialog';

export default function CsvConfigEditorDialog(props) {
  // csvEditorType: ['parse', 'generate']
  const {
    id,
    rule,
    data,
    isSampleDataLoading,
    disabled,
    csvEditorType = 'parse',
    uploadFileAction,
    ...rest
  } = props;
  const defaults = {
    width: '80vw',
    height: '70vh',
    open: true,
  };

  return (
    <AFE2EditorDialog
      id={id}
      {...defaults}
      {...rest}
      showLayoutOptions={false}
      disabled={disabled}
      showFullScreen>
      {csvEditorType === 'generate' ? (
        <CsvGenerateEditor
          disabled={disabled}
          editorId={id}
          rule={rule}
          data={data}
          isSampleDataLoading={isSampleDataLoading}
        />
      ) : (
        <CsvParseEditor
          disabled={disabled}
          editorId={id}
          rule={rule}
          data={data}
          uploadFileAction={uploadFileAction}
        />
      )}
    </AFE2EditorDialog>
  );
}
