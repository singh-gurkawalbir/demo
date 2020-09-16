import React from 'react';
import EditorDrawer from '../EditorDrawer';
import SQLQueryBuilderEditor from './index';

export default function SqlQueryBuilderEditorDrawer(props) {
  const {
    id,
    rule,
    lookups = [],
    sampleData,
    ruleTitle,
    defaultData,
    disabled,
    showDefaultData,
    isSampleDataLoading,
    optionalSaveParams,
    dataTest = 'sqlQueryBuilder',
    ...rest
  } = props;

  return (
    <EditorDrawer
      dataTest={dataTest}
      id={id}
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
        isSampleDataLoading={isSampleDataLoading}
        optionalSaveParams={optionalSaveParams}
      />
    </EditorDrawer>
  );
}
