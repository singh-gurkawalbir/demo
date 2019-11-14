import { useState, useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cloneDeep } from 'lodash';
import Button from '@material-ui/core/Button';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import SqlQueryBuilderEditorDialog from '../../../components/AFE/SqlQueryBuilderEditor/Dialog';
import DynaLookupEditor from './DynaLookupEditor';
import { getDefaultData } from '../../../utils/sampleData';
import { getUnionObject } from '../../../utils/jsonPaths';

export default function DynaSQLQueryBuilder(props) {
  const {
    id,
    onFieldChange,
    options,
    disabled,
    value,
    label,
    arrayIndex,
    resourceId,
    flowId,
    resourceType,
  } = props;
  const [showEditor, setShowEditor] = useState(false);
  const dispatch = useDispatch();
  const sampleData = useSelector(state =>
    selectors.getSampleData(state, flowId, resourceId, 'flowInput', {
      isImport: resourceType === 'imports',
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
    getDefaultData(defaultData),
    null,
    2
  );
  const formattedSampleData = JSON.stringify(sampleData, null, 2);
  const handleEditorClick = () => {
    setShowEditor(!showEditor);
  };

  const parsedRule =
    typeof arrayIndex === 'number' && Array.isArray(value)
      ? value[arrayIndex]
      : value;
  const lookupFieldId = options && options.lookups && options.lookups.fieldId;
  const lookups = options && options.lookups && options.lookups.data;
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
          title="SQL Query Builder"
          id={`${resourceId}-${id}`}
          rule={parsedRule}
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
