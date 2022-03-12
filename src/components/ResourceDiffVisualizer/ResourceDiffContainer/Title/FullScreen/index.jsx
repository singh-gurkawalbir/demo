import React from 'react';
import { IconButton } from '@material-ui/core';
import ExpandWindowIcon from '../../../../icons/ExpandWindowIcon';

export default function FullScreen() {
  const handleClick = () => {
    //   console.log('clicked');
  };

  return (
    <IconButton
      size="small"
      data-test="expandAll"
      onClick={handleClick}>
      <ExpandWindowIcon />
    </IconButton>
  );
}
