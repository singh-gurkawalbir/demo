import React, { useState } from 'react';
import { IconButton } from '@material-ui/core';
import ExpandWindowIcon from '../../../../icons/ExpandWindowIcon';
import FullScreenModal from './FullScreenModal';

export default function FullScreen({ resourceDiff, resourceType }) {
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
            resourceType={resourceType}
            onClose={handleClose}
          />
          )
      }
    </>
  );
}
