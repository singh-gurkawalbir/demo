import React, { useEffect, useCallback, useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { cloneDeep } from 'lodash';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import SqlQueryBuilderEditorDrawer from '../../../AFE/SqlQueryBuilderEditor/Drawer';
import { getDefaultData } from '../../../../utils/sampleData';
import { getUnionObject } from '../../../../utils/jsonPaths';
import DynaLookupEditor from '../DynaLookupEditor';

const ruleTitle = 'Template (use handlebars expressions to map fields from your export data)';
const getEditorTitle = adaptorType => {
  if (adaptorType === 'MongodbImport') {
    return 'MongoDB document builder';
  }
  if (adaptorType === 'DynamodbImport') {
    return 'DynamoDB query builder';
  }
  if (adaptorType === 'RDBMSImport') {
    return 'SQL query builder';
  }
};
export default function SQLQueryBuilderWrapper(props) {
  const {
    id,
    onFieldChange,
    disabled,
    value,
    querySetPos,
    resourceId,
    flowId,
    resourceType,
    hideDefaultData,
    lookups,
    modelMetadata,
    queryType,
    optionalSaveParams,
    patchOnSave,
    method,
    title,
  } = props;
  const dispatch = useDispatch();
  const parsedRule = useMemo(() => typeof querySetPos !== 'undefined' && Array.isArray(value)
    ? value[querySetPos]
    : value,
  [querySetPos, value]);

  const { merged: resourceData = {} } = useSelector(state => selectors.resourceData(state, 'imports', resourceId));
  const { adaptorType} = resourceData;

  const sampleRule = useSelector(state => selectors.sampleRuleForSQLQueryBuilder(
    state, {
      importId: resourceId,
      flowId,
      method,
      queryType,
    }
  ));

  const {data: sampleData, status: flowDataStatus} = useSelector(state =>
    selectors.getSampleDataContext(state, {
      flowId,
      resourceId,
      resourceType,
      stage: 'flowInput',
    }), shallowEqual);
  const extractFields = useSelector(state =>
    selectors.getSampleDataContext(state, {
      flowId,
      resourceId,
      resourceType,
      stage: 'importMappingExtract',
    }).data,
  shallowEqual);

  useEffect(() => {
    if (flowId && !sampleData) {
      dispatch(
        actions.flowData.requestSampleData(
          flowId,
          resourceId,
          resourceType,
          'flowInput'
        )
      );
    }
  }, [dispatch, flowId, resourceId, resourceType, sampleData]);

  useEffect(() => {
    if (flowId && !extractFields) {
      dispatch(
        actions.flowData.requestSampleData(
          flowId,
          resourceId,
          'imports',
          'importMappingExtract'
        )
      );
    }
  }, [dispatch, extractFields, flowId, resourceId]);
  const defaultTitle = getEditorTitle(adaptorType);

  const formattedDefaultData = useMemo(() => {
    if (modelMetadata) {
      return JSON.stringify({ data: modelMetadata }, null, 2);
    }
    let defaultData = {};

    if (Array.isArray(sampleData) && sampleData.length && typeof sampleData[0] === 'object') {
      defaultData = cloneDeep(getUnionObject(sampleData));
    } else if (sampleData) {
      defaultData = cloneDeep(sampleData);
    }

    return JSON.stringify(
      { data: getDefaultData(defaultData) },
      null,
      2
    );
  }, [modelMetadata, sampleData]);

  // the behavior is different from ampersand where we were displaying sample data directly. It is to be wrapped as {data: sampleData}
  const formattedSampleData = JSON.stringify({ data: sampleData }, null, 2);

  const handleSave = useCallback((shouldCommit, editorValues) => {
    if (shouldCommit) {
      const { template, defaultData } = editorValues;

      if (adaptorType === 'RDBMSImport') {
        let parsedDefaultData;

        try {
          parsedDefaultData = JSON.parse(defaultData);

          if (parsedDefaultData.data) {
            onFieldChange('modelMetadata', parsedDefaultData.data);
          }
        } catch (e) { // do nothing }
        }
      }
      if (typeof querySetPos !== 'undefined' && Array.isArray(value)) {
        // save to array at position querySetPos
        const valueTmp = value;

        valueTmp[querySetPos] = template;
        onFieldChange(id, valueTmp);
      } else {
        // save to field
        onFieldChange(id, template);
      }
    }
  }, [adaptorType, querySetPos, id, onFieldChange, value]);

  const lookupField = useMemo(() => {
    if (adaptorType === 'RDBMSImport') {
      return (
        <DynaLookupEditor
          id="rdbms.lookups"
          label="Manage lookups"
          value={lookups}
          onFieldChange={onFieldChange}
          flowId={flowId}
          resourceType={resourceType}
          resourceId={resourceId}
/>
      );
    }
  }, [adaptorType, flowId, lookups, onFieldChange, resourceId, resourceType]);

  return (
    <>
      <SqlQueryBuilderEditorDrawer
        title={title || defaultTitle}
        id={`${resourceId}-${id}`}
        rule={parsedRule}
        sampleRule={sampleRule}
        lookups={lookups}
        sampleData={formattedSampleData}
        defaultData={formattedDefaultData}
        onFieldChange={onFieldChange}
        onSave={handleSave}
        action={lookupField}
        disabled={disabled}
        showDefaultData={!hideDefaultData}
        ruleTitle={ruleTitle}
        path={id}
        isSampleDataLoading={flowDataStatus === 'requested'}
        optionalSaveParams={optionalSaveParams}
        patchOnSave={patchOnSave}
        />
    </>
  );
}
