import React from 'react';
import EditorDialog from '../EditorDialog';
import SQLQueryBuilderEditor from './index';

function SqlQueryBuilderEditorDialog(props) {
  const defaults = {
    width: '80vw',
    height: '70vh',
    open: true,
  };
  const {
    id,
    rule,
    lookups = [],
    sampleData,
    ruleTitle,
    defaultData,
    disabled,
    showDefaultData,
    ...rest
  } = props;

  return (
    <EditorDialog
      dataTest="sqlQueryBuilder"
      id={id}
      {...defaults}
      {...rest}
      disabled={disabled}>
      <SQLQueryBuilderEditor
        disabled={disabled}
        lookups={lookups}
        sampleData={sampleData}
        defaultData={defaultData}
        rule={rule}
        ruleTitle={ruleTitle}
        editorId={id}
        showDefaultData={showDefaultData}
      />
    </EditorDialog>
  );
}

export default SqlQueryBuilderEditorDialog;
