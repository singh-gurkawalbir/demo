import React from 'react';
import CsvParseEditor from './CsvParser';
import CsvGenerateEditor from './CsvGenerator';
import AFE2EditorDrawer from '../AFE2Editor/Drawer';

const defaults = {
  width: '80vw',
  height: '70vh',
  open: true,
};

export default function CsvConfigEditorDrawer(props) {
  // csvEditorType: ['parse', 'generate']
  const {
    id,
    rule,
    data,
    isSampleDataLoading,
    disabled,
    csvEditorType = 'parse',
    editorDataTitle,
    ...rest
  } = props;

  return (
    <AFE2EditorDrawer
      id={id}
      {...defaults}
      {...rest}
      showLayoutOptions={false}
      disabled={disabled}
      showFullScreen>
      {csvEditorType === 'generate' ? (
        <CsvGenerateEditor
          disabled={disabled}
          // editorId={id}
          rule={rule}
          data={data}
          isSampleDataLoading={isSampleDataLoading}
        />
      ) : (
        <CsvParseEditor
          disabled={disabled}
          // editorId={id}
          rule={rule}
          data={data}
          editorDataTitle={editorDataTitle}
        />
      )}
    </AFE2EditorDrawer>
  );
}
