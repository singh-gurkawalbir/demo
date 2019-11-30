import { useState, Fragment } from 'react';
import { Button } from '@material-ui/core';
import ManageLookupDialog from '../../../components/AFE/ManageLookup/Dialog';

export default function DynaLookupEditor(props) {
  const [showEditor, setShowEditor] = useState(false);
  const { id, onFieldChange, value, label, options } = props;
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
          onCancel={handleEditorClick}
          onUpdate={handleUpdate}
          options={options}
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
