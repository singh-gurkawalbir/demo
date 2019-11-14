import React from 'react';
import EditorDialog from '../EditorDialog';
import SQLQueryBuilderEditor from './index';

function SqlQueryBuilderEditorDialog(props) {
  const defaults = {
    width: '80vw',
    height: '50vh',
    open: true,
  };
  const { id, rule, sampleData, defaultData, disabled, ...rest } = props;

  return (
    <EditorDialog id={id} {...defaults} {...rest} disabled={disabled}>
      <SQLQueryBuilderEditor
        disabled={disabled}
        sampleData={sampleData}
        defaultData={defaultData}
        rule={rule}
        editorId={id}
      />
    </EditorDialog>
  );
}

export default SqlQueryBuilderEditorDialog;
