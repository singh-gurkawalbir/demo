import React, { useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cloneDeep } from 'lodash';
import { adaptorTypeMap } from '../../../../utils/resource';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import SqlQueryBuilderEditorDrawer from '../../../AFE/SqlQueryBuilderEditor/Drawer';
import { getDefaultData } from '../../../../utils/sampleData';
import getJSONPaths, { getUnionObject } from '../../../../utils/jsonPaths';
import sqlUtil from '../../../../utils/sql';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import DynaLookupEditor from '../DynaLookupEditor';

export default function SQLQueryBuilderWrapper(props) {
  const {
    id,
    onFieldChange,
    options = {},
    disabled,
    value,
    title,
    ruleTitle,
    arrayIndex,
    resourceId,
    flowId,
    resourceType,
    hideDefaultData,
    lookups,
    lookupFieldId,
    modelMetadata,
    modelMetadataFieldId,
    queryType,
    optionalSaveParams,
    patchOnSave,

  } = props;
  const {
    method,
  } = options;

  const dispatch = useDispatch();
  const { merged: resourceData } = useSelectorMemo(
    selectors.makeResourceDataSelector,
    'imports',
    resourceId
  );
  const { adaptorType: resourceAdapterType, _connectionId: connectionId} = resourceData;
  const {data: sampleData, status: flowDataStatus} = useSelector(state =>
    selectors.getSampleDataContext(state, {
      flowId,
      resourceId,
      resourceType,
      stage: 'flowInput',
    })
  );
  const {data: extractFields } = useSelector(state =>
    selectors.getSampleDataContext(state, {
      flowId,
      resourceId,
      resourceType,
      stage: 'importMappingExtract',
    })
  );

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
  const connection = useSelector(state =>
    selectors.resource(state, 'connections', connectionId)
  );
  const rdbmsSubType = connection?.rdbms?.type;
  const parsedRule = useMemo(() => typeof arrayIndex !== 'undefined' && Array.isArray(value)
    ? value[arrayIndex]
    : value,
  [arrayIndex, value]);

  const sampleRule = useMemo(() => {
    if (sampleData && extractFields) {
      const extractPaths = getJSONPaths(extractFields, null, {
        wrapSpecialChars: true,
      });

      if (adaptorTypeMap[resourceAdapterType] === adaptorTypeMap.MongodbImport) {
        return sqlUtil.getSampleMongoDbTemplate(
          sampleData,
          extractPaths,
          queryType === 'insertMany'
        );
      } if (
        adaptorTypeMap[resourceAdapterType] === adaptorTypeMap.DynamodbImport
      ) {
        return sqlUtil.getSampleDynamodbTemplate(
          sampleData,
          extractPaths,
          method === 'putItem'
        );
      } if (
        adaptorTypeMap[resourceAdapterType] === adaptorTypeMap.RDBMSImport && rdbmsSubType === 'snowflake'
      ) {
        return sqlUtil.getSampleSnowflakeTemplate(
          sampleData,
          extractPaths,
          queryType === 'INSERT'
        );
      }

      return sqlUtil.getSampleSQLTemplate(
        sampleData,
        extractPaths,
        queryType === 'INSERT'
      );
    }
  }, [extractFields, method, queryType, rdbmsSubType, resourceAdapterType, sampleData]);

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

      if (modelMetadataFieldId && !hideDefaultData) {
        let parsedDefaultData;

        try {
          parsedDefaultData = JSON.parse(defaultData);

          if (parsedDefaultData.data) {
            onFieldChange(modelMetadataFieldId, parsedDefaultData.data);
          }
        } catch (e) {
          // do nothing
        }
      }
      if (typeof arrayIndex !== 'undefined' && Array.isArray(value)) {
        // save to array at position arrayIndex
        const valueTmp = value;

        valueTmp[arrayIndex] = template;
        onFieldChange(id, valueTmp);
      } else {
        // save to field
        onFieldChange(id, template);
      }
    }
  }, [arrayIndex, hideDefaultData, id, modelMetadataFieldId, onFieldChange, value]);

  const lookupField = useMemo(() => {
    if (lookupFieldId) {
      return (
        <DynaLookupEditor
          id={lookupFieldId}
          label="Manage lookups"
          value={lookups}
          onFieldChange={onFieldChange}
          flowId={flowId}
          resourceType={resourceType}
          resourceId={resourceId}
/>
      );
    }
  }, [flowId, lookupFieldId, lookups, onFieldChange, resourceId, resourceType]);

  return (
    <>
      <SqlQueryBuilderEditorDrawer
        title={title}
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
