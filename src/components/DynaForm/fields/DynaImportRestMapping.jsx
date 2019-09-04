import { useState, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import RestImportMappingEditor from '../../../components/AFE/RestImportMapping';

export default function DynaImportRestMapping(props) {
  const { id, onFieldChange, options, label, value } = props;
  // Lookup Functionality enhancement pending
  const lookupFieldId = options && options.lookups && options.lookups.fieldId;
  const lookups = options && options.lookups && options.lookups.data;
  const [showEditor, setShowEditor] = useState(false);
  const handleEditorClick = () => {
    setShowEditor(!showEditor);
  };

  const handleClose = (shouldCommit, mappings) => {
    if (shouldCommit) {
      onFieldChange(id, { fields: mappings });
    }

    handleEditorClick();
  };

  return (
    <Fragment>
      {showEditor && (
        <RestImportMappingEditor
          title="Define Import Mapping"
          id={id}
          onFieldChange={onFieldChange}
          lookups={lookups}
          mappings={value}
          lookupFieldId={lookupFieldId}
          onClose={handleClose}
        />
      )}
      <Button variant="outlined" color="secondary" onClick={handleEditorClick}>
        {label}
      </Button>
    </Fragment>
  );
}
