import React from 'react';
import AFE2EditorDrawer from '../AFE2Editor/Drawer';
import SQLQueryBuilderEditor from './index';

export default function SqlQueryBuilderEditorDrawer(props) {
  const {
    id,
    rule,
    lookups,
    sampleData,
    defaultData,
    disabled,
    showDefaultData,
    isSampleDataLoading,
    optionalSaveParams,
    dataTest = 'sqlQueryBuilder',
    editorVersion,
    ...rest
  } = props;

  return (
    <AFE2EditorDrawer
      dataTest={dataTest}
      id={id}
      {...rest}
      disabled={disabled}
      editorVersion={editorVersion}>
      <SQLQueryBuilderEditor
        disabled={disabled}
        lookups={lookups}
        sampleData={sampleData}
        defaultData={defaultData}
        rule={rule}
        editorId={id}
        showDefaultData={showDefaultData}
        isSampleDataLoading={isSampleDataLoading}
        optionalSaveParams={optionalSaveParams}
        editorVersion={editorVersion}
      />
    </AFE2EditorDrawer>
  );
}
