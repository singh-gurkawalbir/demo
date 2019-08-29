import { useState, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import HttpRequestBodyEditorDialog from '../../../components/AFE/HttpRequestBodyEditor/Dialog';
import DynaLookupEditor from './DynaLookupEditor';

export default function DynaHttpRequestBody(props) {
  const { id, onFieldChange, options, value, label } = props;
  const [showEditor, setShowEditor] = useState(false);
  const parsedData =
    options && typeof options.saveIndex === 'number' && value && value.length
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
        value &&
        value.length
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

  let actionFields = [];

  if (lookupFieldId) {
    actionFields = [
      {
        field: (
          <DynaLookupEditor
            id={lookupFieldId}
            label="Manage Lookups"
            value={lookups}
            key={lookupFieldId}
            onFieldChange={onFieldChange}
          />
        ),
      },
    ];
  }

  return (
    <Fragment>
      {showEditor && (
        <HttpRequestBodyEditorDialog
          title="Build HTTP Request Body"
          id={id}
          rule={parsedData}
          onFieldChange={onFieldChange}
          onClose={handleClose}
          actionFields={actionFields}
        />
      )}
      <Button variant="outlined" color="secondary" onClick={handleEditorClick}>
        {label}
      </Button>
    </Fragment>
  );
}
