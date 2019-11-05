import { useState, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import HttpRequestBodyEditorDialog from '../../../components/AFE/HttpRequestBodyEditor/Dialog';
import DynaLookupEditor from './DynaLookupEditor';
import {
  getXMLSampleTemplate,
  getJSONSampleTemplate,
} from '../../AFE/HttpRequestBodyEditor/templateMapping';

const sampleData = {
  id: '48327',
  recordType: 'customer',
  Name: '1ScrewedUp',
  Email: '',
  Phone: '',
  'Office Phone': '',
  Fax: '',
  'Primary Contact': '',
  'Alt. Email': '',
};

export default function DynaHttpRequestBody(props) {
  const { id, onFieldChange, options, value, label, resourceId } = props;
  const { lookups: lookupsObj, saveIndex, contentType } = options;
  const [showEditor, setShowEditor] = useState(false);
  let parsedData =
    options && typeof saveIndex === 'number' && Array.isArray(value)
      ? value[saveIndex]
      : value;
  const lookupFieldId = lookupsObj && lookupsObj.fieldId;
  const lookups = lookupsObj && lookupsObj.data;
  const handleEditorClick = () => {
    setShowEditor(!showEditor);
  };

  const handleClose = (shouldCommit, editorValues) => {
    if (shouldCommit) {
      const { template } = editorValues;

      if (typeof saveIndex === 'number' && Array.isArray(value)) {
        // save to array at position saveIndex
        const valueTmp = value;

        valueTmp[saveIndex] = template;
        onFieldChange(id, valueTmp);
      } else {
        // save to field
        onFieldChange(id, template);
      }
    }

    handleEditorClick();
  };

  if (!parsedData) {
    if (contentType === 'json') parsedData = getJSONSampleTemplate(sampleData);
    else parsedData = getXMLSampleTemplate(sampleData);
  }

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
          contentType={contentType === 'json' ? 'json' : 'xml'}
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
