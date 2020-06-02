import { useState, Fragment } from 'react';
import { Button } from '@material-ui/core';
import LookupDialog from '../../Lookup/index';

export default function DynaLookupEditor(props) {
  const [showEditor, setShowEditor] = useState(false);
  const {
    id,
    onFieldChange,
    value,
    label,
    connectionId,
    resourceId,
    resourceType,
    flowId,
  } = props;
  const handleEditorClick = () => {
    setShowEditor(!showEditor);
  };

  const handleUpdate = lookups => {
    onFieldChange(id, lookups);
  };

  return (
    <Fragment>
      {showEditor && (
        <LookupDialog
          id={id}
          lookups={value}
          onCancel={handleEditorClick}
          connectionId={connectionId}
          resourceId={resourceId}
          resourceType={resourceType}
          flowId={flowId}
          onSave={handleUpdate}
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
