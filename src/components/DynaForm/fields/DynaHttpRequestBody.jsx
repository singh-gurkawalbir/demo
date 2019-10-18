import { useState, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import HttpRequestBodyEditorDialog from '../../../components/AFE/HttpRequestBodyEditor/Dialog';
import DynaLookupEditor from './DynaLookupEditor';

export default function DynaHttpRequestBody(props) {
  const { id, onFieldChange, options, value, label, resourceId } = props;
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
