import React from 'react';
import HandlebarsWithDefaultEditor from '../HandlebarsWithDefault';

export default function SqlQueryBuilderEditor(props) {
  const {
    rule,
    editorId,
    disabled,
    lookups = [],
    layout = 'compact',
    ruleTitle,
    sampleData,
    defaultData,
    showDefaultData = true,
    isSampleDataLoading = false,
  } = props;

  return (
    <HandlebarsWithDefaultEditor
      disabled={disabled}
      editorId={editorId}
      rule={rule}
      defaultData={defaultData}
      sampleData={sampleData}
      layout={layout}
      lookups={lookups}
      // override the default implementation for layout
      // templateClassName={}
      processor="sqlQueryBuilder"
      ruleMode="handlebars"
      dataMode="json"
      resultMode="text"
      ruleTitle={ruleTitle || 'Template'}
      resultTitle="Preview"
      showDefaultData={showDefaultData}
      isSampleDataLoading={isSampleDataLoading}
    />
  );
}
