import { useState, Fragment } from 'react';
import { IconButton } from '@material-ui/core';
import MappingIcon from '../icons/MapDataIcon';
import StandaloneImportMapping from '../AFE/ImportMapping/StandaloneImportMapping';

export default function Mapping({ resourceId }) {
  const [showDialog, setShowDialog] = useState(false);
  const handleClose = () => {
    setShowDialog(false);
  };

  return (
    <Fragment>
      {showDialog && (
        <StandaloneImportMapping
          resourceId={resourceId}
          onClose={handleClose}
        />
      )}
      <IconButton
        size="small"
        onClick={() => {
          setShowDialog(!showDialog);
        }}>
        <MappingIcon />
      </IconButton>
    </Fragment>
  );
}
