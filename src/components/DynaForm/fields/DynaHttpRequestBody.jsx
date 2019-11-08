import { useState, useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import * as selectors from '../../../reducers';
import HttpRequestBodyEditorDialog from '../../../components/AFE/HttpRequestBodyEditor/Dialog';
import DynaLookupEditor from './DynaLookupEditor';
import actions from '../../../actions';

export default function DynaHttpRequestBody(props) {
  const {
    id,
    onFieldChange,
    options,
    value,
    label,
    resourceId,
    resourceType,
    flowId,
  } = props;
  const [showEditor, setShowEditor] = useState(false);
  const parsedData =
    options && typeof options.saveIndex === 'number' && Array.isArray(value)
      ? value[options.saveIndex]
      : value;
  const lookupFieldId = options && options.lookups && options.lookups.fieldId;
  const lookups = options && options.lookups && options.lookups.data;
  const handleEditorClick = () => {
    setShowEditor(!showEditor);
  };

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

  const handleClose = (shouldCommit, editorValues) => {
    if (shouldCommit) {
      const { template } = editorValues;

      if (
        options &&
        typeof options.saveIndex === 'number' &&
        Array.isArray(value)
      ) {
        // save to array at position saveIndex
        const valueTmp = value;

        valueTmp[options.saveIndex] = template;
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
        <HttpRequestBodyEditorDialog
          title="Build HTTP Request Body"
          id={`${resourceId}-${id}`}
          rule={parsedData}
          onFieldChange={onFieldChange}
          data={JSON.stringify(sampleData, null, 2)}
          onClose={handleClose}
          action={lookupField}
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
