import React, { useState } from 'react';
import { IconButton } from '@material-ui/core';
import MappingIcon from '../icons/MapDataIcon';
// import StandaloneImportMapping from '../AFE/ImportMapping/StandaloneImportMapping';

export default function Mapping() {
  // { resourceId, connectionId }
  const [showDialog, setShowDialog] = useState(false);
  // const handleClose = () => {
  //   setShowDialog(false);
  // };

  return (
    <>
      {/* {showDialog && (
        <StandaloneImportMapping
          resourceId={resourceId}
          connectionId={connectionId}
          onClose={handleClose}
        />
      )} */}
      <IconButton
        data-test="toggleMappingDialog"
        size="small"
        onClick={() => {
          setShowDialog(!showDialog);
        }}>
        <MappingIcon />
      </IconButton>
    </>
  );
}
