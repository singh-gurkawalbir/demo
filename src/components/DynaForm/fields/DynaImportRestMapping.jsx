import { useState, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import RestImportMapping from '../../../components/AFE/RestImportMapping';

export default function DynaImportRestMapping(props) {
  const {
    id,
    onFieldChange,
    options,
    label,
    value,
    extractFields,
    generateFields,
  } = props;
  // lookupFieldId and  lookups are to be used for lookups. Enhancement pending
  // const lookupFieldId = options && options.lookups && options.lookups.fieldId;
  // const lookups = options && options.lookups && options.lookups.data;
  const [showEditor, setShowEditor] = useState(false);
  const handleEditorClick = () => {
    setShowEditor(!showEditor);
  };

  const handleClose = (shouldCommit, mappings, lookups) => {
    if (shouldCommit) {
      onFieldChange(id, { fields: mappings });

      if (lookups) {
        onFieldChange(options.lookupId, lookups);
      }
    }

    handleEditorClick();
  };

  return (
    <Fragment>
      {showEditor && (
        <RestImportMapping
          title="Define Import Mapping"
          id={id}
          lookups={options && options.lookups}
          onFieldChange={onFieldChange}
          // lookups={lookups}
          mappings={value}
          generateFields={generateFields || []}
          extractFields={extractFields || []}
          // lookupFieldId={lookupFieldId}
          onClose={handleClose}
        />
      )}
      <Button variant="outlined" color="secondary" onClick={handleEditorClick}>
        {label}
      </Button>
    </Fragment>
  );
}
