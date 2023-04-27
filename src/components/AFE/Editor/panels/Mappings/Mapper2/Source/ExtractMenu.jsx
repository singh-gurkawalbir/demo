import React, { useState, useEffect } from 'react';
import { ClickAwayListener } from '@mui/material';
import { Box } from '@celigo/fuse-ui';

export default function ({children, anchorRef, onClickAway, open, defaultHeight = 40}) {
  const [height, setHeight] = useState(defaultHeight);

  useEffect(() => {
    const height = anchorRef?.current?.clientHeight || defaultHeight;

    // console.log('anchorRef height', height);
    setHeight(height);
  }, [anchorRef, anchorRef?.current?.clientHeight, defaultHeight]);

  if (!open) return null;

  return (
    <ClickAwayListener onClickAway={onClickAway}>
      <Box
        position="absolute"
        zIndex={1300}
        border="solid 1px"
        borderColor="secondary.lightest"
        width="100%"
        top={height}
        bgcolor="background.paper"
      >
        {children}
      </Box>
    </ClickAwayListener>
  );
}
