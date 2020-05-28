import { useState, useEffect, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { cloneDeep } from 'lodash';
import { Button, FormLabel } from '@material-ui/core';
import { adaptorTypeMap } from '../../../utils/resource';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import SqlQueryBuilderEditorDialog from '../../../components/AFE/SqlQueryBuilderEditor/Dialog';
import DynaLookupEditor from './DynaLookupEditor';
import { getDefaultData } from '../../../utils/sampleData';
import getJSONPaths, { getUnionObject } from '../../../utils/jsonPaths';
import sqlUtil from '../../../utils/sql';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';

const useStyles = makeStyles(theme => ({
  sqlContainer: {
    flexDirection: `row !important`,
    width: '100%',
    alignItems: 'center',
  },
  sqlBtn: {
    marginRight: theme.spacing(0.5),
  },
  sqlLabel: {
    marginBottom: 0,
    marginRight: 12,
    maxWidth: '50%',
    wordBreak: 'break-word',
  },
}));

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
  const [showEditor, setShowEditor] = useState(false);
  const dispatch = useDispatch();
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
  const { adaptorType: resourceAdapterType } = resourceData;
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
  const handleEditorClick = () => {
    setShowEditor(!showEditor);
  };

  const handleClose = (shouldCommit, editorValues) => {
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

    handleEditorClick();
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
    <Fragment>
      <div className={classes.sqlContainer}>
        {showEditor && (
          <SqlQueryBuilderEditorDialog
            key={changeIdentifier}
            title={title}
            id={`${resourceId}-${id}`}
            rule={parsedRule}
            lookups={lookups}
            sampleData={formattedSampleData}
            defaultData={formattedDefaultData}
            onFieldChange={onFieldChange}
            onClose={handleClose}
            action={lookupField}
            disabled={disabled}
            showDefaultData={!hideDefaultData}
            ruleTitle={ruleTitle}
          />
        )}
        <FormLabel className={classes.sqlLabel}>{label}:</FormLabel>
        <Button
          className={classes.sqlBtn}
          data-test={id}
          variant="outlined"
          onClick={handleEditorClick}>
          {'Configure'}
        </Button>
      </div>
    </Fragment>
  );
}
