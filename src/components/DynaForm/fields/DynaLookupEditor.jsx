import { useState, Fragment } from 'react';
import { Button } from '@material-ui/core';
import ManageLookup from '../../../components/AFE/ManageLookup';

export default function DynaLookupEditor(props) {
  const [showEditor, setShowEditor] = useState(false);
  const { id, onFieldChange, value, label } = props;
  const handleEditorClick = () => {
    setShowEditor(!showEditor);
  };

  const updateLookups = lookups => {
    onFieldChange(id, lookups);
  };

  return (
    <Fragment>
      {showEditor && (
        <ManageLookup
          id={id}
          lookups={value}
          onCancelClick={handleEditorClick}
          updateLookups={updateLookups}
        />
      )}
      <Button variant="outlined" color="secondary" onClick={handleEditorClick}>
        {label}
      </Button>
    </Fragment>
  );
}
