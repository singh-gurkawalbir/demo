import { useState, Fragment } from 'react';
import { Button } from '@material-ui/core';
import ManageLookupDialog from '../../../components/AFE/ManageLookup/Dialog';

export default function DynaLookupEditor(props) {
  const [showEditor, setShowEditor] = useState(false);
  const { id, isSQLLookup, onFieldChange, value, label } = props;
  const handleEditorClick = () => {
    setShowEditor(!showEditor);
  };

  const handleUpdate = lookups => {
    onFieldChange(id, lookups);
  };

  return (
    <Fragment>
      {showEditor && (
        <ManageLookupDialog
          id={id}
          lookups={value}
          isSQLLookup={isSQLLookup}
          onCancel={handleEditorClick}
          onUpdate={handleUpdate}
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
