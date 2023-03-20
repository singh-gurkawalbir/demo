import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import ExpandWindowIcon from '../../../../icons/ExpandWindowIcon';
import FullScreenModal from './FullScreenModal';

export default function FullScreen({ resourceDiff, resourceType, integrationId, titles }) {
  const [showFullScreen, setShowFullScreen] = useState(false);
  const handleClick = () => {
    setShowFullScreen(showFullScreen => !showFullScreen);
  };
  const handleClose = () => setShowFullScreen(false);

  return (
    <>
      <IconButton
        size="small"
        data-test="expandAll"
        onClick={handleClick}>
        <ExpandWindowIcon />
      </IconButton>
      {
          showFullScreen && (
          <FullScreenModal
            resourceDiff={resourceDiff}
            titles={titles}
            resourceType={resourceType}
            onClose={handleClose}
            integrationId={integrationId}
          />
          )
      }
    </>
  );
}
