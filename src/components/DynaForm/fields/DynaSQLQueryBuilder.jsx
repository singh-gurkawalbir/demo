import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { cloneDeep } from 'lodash';
import { Button, FormLabel } from '@material-ui/core';
import { adaptorTypeMap } from '../../../utils/resource';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import SqlQueryBuilderEditorDrawer from '../../AFE/SqlQueryBuilderEditor/Drawer';
import DynaLookupEditor from './DynaLookupEditor';
import { getDefaultData } from '../../../utils/sampleData';
import getJSONPaths, { getUnionObject } from '../../../utils/jsonPaths';
import sqlUtil from '../../../utils/sql';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import FieldHelp from '../FieldHelp';
import usePushRightDrawer from '../../../hooks/usePushRightDrawer';

const useStyles = makeStyles({
  sqlContainer: {
    width: '100%',
  },
  sqlBtn: {
    maxWidth: 100,
  },
  sqlLabel: {
    marginBottom: 6,
  },
  sqlLabelWrapper: {
    display: 'flex',
  },
});

export default function DynaSQLQueryBuilder(props) {
  const classes = useStyles();
  const {
    id,
    onFieldChange,
    options = {},
    disabled,
    value,
    label,
    title,
    ruleTitle,
    arrayIndex,
    resourceId,
    flowId,
    resourceType,
    hideDefaultData,
  } = props;
  const {
    lookups: lookupObj,
    modelMetadata,
    modelMetadataFieldId,
    queryType,
    method,
  } = options;
  const lookupFieldId = lookupObj && lookupObj.fieldId;
  const lookups = (lookupObj && lookupObj.data) || [];
  const dispatch = useDispatch();
  const pushRightDrawer = usePushRightDrawer(id);
  const [dataState, setDataState] = useState({
    sampleDataLoaded: false,
    extractFieldsLoaded: false,
    changeIdentifier: 0,
  });
  const { merged: resourceData } = useSelectorMemo(
    selectors.makeResourceDataSelector,
    'imports',
    resourceId
  );
  const { adaptorType: resourceAdapterType, _connectionId: connectionId} = resourceData;
  const { sampleDataLoaded, extractFieldsLoaded, changeIdentifier } = dataState;
  const sampleData = useSelector(state =>
    selectors.getSampleData(state, {
      flowId,
      resourceId,
      resourceType,
      stage: 'flowInput',
    })
  );
  const extractFields = useSelector(state =>
    selectors.getSampleData(state, {
      flowId,
      resourceId,
      resourceType,
      stage: 'importMappingExtract',
    })
  );

  useEffect(() => {
    // Request for sample data only incase of flow context
    // TODO : @Raghu Do we show default data in stand alone context?
    // What type of sample data is expected in case of Page generators
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

  if (sampleData && !sampleDataLoaded) {
    setDataState({
      ...dataState,
      sampleDataLoaded: true,
      changeIdentifier: changeIdentifier + 1,
    });
  } else if (extractFields && !extractFieldsLoaded) {
    setDataState({
      ...dataState,
      extractFieldsLoaded: true,
      changeIdentifier: changeIdentifier + 1,
    });
  }

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
  let parsedRule =
    typeof arrayIndex === 'number' && Array.isArray(value)
      ? value[arrayIndex]
      : value;

  if (sampleData && extractFields && !parsedRule) {
    const extractPaths = getJSONPaths(extractFields, null, {
      wrapSpecialChars: true,
    });

    if (adaptorTypeMap[resourceAdapterType] === adaptorTypeMap.MongodbImport) {
      parsedRule = sqlUtil.getSampleMongoDbTemplate(
        sampleData,
        extractPaths,
        queryType === 'insertMany'
      );
    } else if (
      adaptorTypeMap[resourceAdapterType] === adaptorTypeMap.DynamodbImport
    ) {
      parsedRule = sqlUtil.getSampleDynamodbTemplate(
        sampleData,
        extractPaths,
        method === 'putItem'
      );
    } else if (
      adaptorTypeMap[resourceAdapterType] === adaptorTypeMap.RDBMSImport && rdbmsSubType === 'snowflake'
    ) {
      parsedRule = sqlUtil.getSampleSnowflakeTemplate(
        sampleData,
        extractPaths,
        queryType === 'INSERT'
      );
    } else {
      parsedRule = sqlUtil.getSampleSQLTemplate(
        sampleData,
        extractPaths,
        queryType === 'INSERT'
      );
    }
  }

  let defaultData = {};
  let formattedDefaultData;

  if (modelMetadata) {
    formattedDefaultData = JSON.stringify({ data: modelMetadata }, null, 2);
  } else {
    if (sampleData) {
      if (
        Array.isArray(sampleData) &&
        !!sampleData.length &&
        typeof sampleData[0] === 'object'
      ) {
        defaultData = cloneDeep(getUnionObject(sampleData));
      } else defaultData = cloneDeep(sampleData);
    }

    formattedDefaultData = JSON.stringify(
      { data: getDefaultData(defaultData) },
      null,
      2
    );
  }

  // the behavior is different from ampersand where we were displaying sample data directly. It is to be wrapped as {data: sampleData}
  const formattedSampleData = JSON.stringify({ data: sampleData }, null, 2);

  const handleSave = (shouldCommit, editorValues) => {
    if (shouldCommit) {
      const { template, defaultData } = editorValues;

      if (typeof arrayIndex === 'number' && Array.isArray(value)) {
        // save to array at position arrayIndex
        const valueTmp = value;

        valueTmp[arrayIndex] = template;
        onFieldChange(id, valueTmp);
      } else {
        // save to field
        onFieldChange(id, template);
      }

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
    }
  };

  let lookupField;

  if (lookupFieldId) {
    lookupField = (
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

  return (
    <>
      <div className={classes.sqlContainer}>
        <SqlQueryBuilderEditorDrawer
          key={changeIdentifier}
          title={title}
          id={`${resourceId}-${id}`}
          rule={parsedRule}
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
          />

        <div className={classes.sqlLabelWrapper}>
          <FormLabel className={classes.sqlLabel}>{label}</FormLabel>
          <FieldHelp {...props} />
        </div>
        <Button
          className={classes.sqlBtn}
          data-test={id}
          variant="outlined"
          color="secondary"
          onClick={pushRightDrawer}>
          Launch
        </Button>
      </div>
    </>
  );
}
