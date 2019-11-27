import { useState, useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cloneDeep } from 'lodash';
import Button from '@material-ui/core/Button';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import SqlQueryBuilderEditorDialog from '../../../components/AFE/SqlQueryBuilderEditor/Dialog';
import DynaLookupEditor from './DynaLookupEditor';
import { getDefaultData } from '../../../utils/sampleData';
import getJSONPaths, { getUnionObject } from '../../../utils/jsonPaths';

const getSampleSQLTemplate = (sampleData, eFields, isInsert) => {
  let toReturn = '';

  if (eFields && eFields.length > 0 && Array.isArray(sampleData)) {
    if (isInsert) {
      toReturn = `${'Insert into Employee(id) Values({{data.0.'}${
        eFields[0].id
      }}})`;
    } else {
      toReturn = `${'Update Employee SET name={{data.0.'}${
        eFields[0].id
      }}} where id ={{data.0.${eFields[0].id}}}`;
    }
  } else if (eFields && eFields.length > 0) {
    if (isInsert) {
      toReturn = `${'Insert into Employee(id) Values({{data.'}${
        eFields[0].id
      }}})`;
    } else {
      toReturn = `${'Update Employee SET name={{data.'}${
        eFields[0].id
      }}} where id ={{data.${eFields[0].id}}}`;
    }
  }

  return toReturn;
};

export default function DynaSQLQueryBuilder(props) {
  const {
    id,
    onFieldChange,
    options = {},
    disabled,
    value,
    label,
    arrayIndex,
    resourceId,
    flowId,
    resourceType,
  } = props;
  const { lookups: lookupObj, queryType } = options;
  const lookupFieldId = lookupObj && lookupObj.fieldId;
  const lookups = (lookupObj && lookupObj.data) || [];
  const [showEditor, setShowEditor] = useState(false);
  const dispatch = useDispatch();
  const [dataState, setDataState] = useState({
    sampleDataLoaded: false,
    extractFieldsLoaded: false,
    changeIdentifier: 0,
  });
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
    if (!extractFields) {
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
    const extractPaths = getJSONPaths(extractFields);

    parsedRule = getSampleSQLTemplate(
      sampleData,
      extractPaths,
      queryType === 'INSERT'
    );
  }

  let defaultData = {};

  if (sampleData) {
    if (
      Array.isArray(sampleData) &&
      !!sampleData.length &&
      typeof sampleData[0] === 'object'
    ) {
      defaultData = cloneDeep(getUnionObject(sampleData));
    } else defaultData = cloneDeep(sampleData);
  }

  const formattedDefaultData = JSON.stringify(
    { data: getDefaultData(defaultData) },
    null,
    2
  );
  const formattedSampleData = JSON.stringify({ data: sampleData }, null, 2);
  const handleEditorClick = () => {
    setShowEditor(!showEditor);
  };

  const handleClose = (shouldCommit, editorValues) => {
    if (shouldCommit) {
      const { template } = editorValues;

      if (typeof arrayIndex === 'number' && Array.isArray(value)) {
        // save to array at position arrayIndex
        const valueTmp = value;

        valueTmp[arrayIndex] = template;
        onFieldChange(id, valueTmp);
      } else {
        // save to field
        onFieldChange(id, template);
      }
    }

    handleEditorClick();
  };

  let lookupField;

  if (lookupFieldId) {
    lookupField = (
      <DynaLookupEditor
        id={lookupFieldId}
        label="Manage Lookups"
        value={lookups}
        onFieldChange={onFieldChange}
      />
    );
  }

  return (
    <Fragment>
      {showEditor && (
        <SqlQueryBuilderEditorDialog
          key={changeIdentifier}
          title="SQL Query Builder"
          id={`${resourceId}-${id}`}
          rule={parsedRule}
          lookups={lookups}
          sampleData={formattedSampleData}
          defaultData={formattedDefaultData}
          onFieldChange={onFieldChange}
          onClose={handleClose}
          action={lookupField}
          disabled={disabled}
        />
      )}
      <Button
        data-test={id}
        variant="outlined"
        color="secondary"
        onClick={handleEditorClick}>
        {label}
      </Button>
    </Fragment>
  );
}
