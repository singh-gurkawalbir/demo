import React, { useState} from 'react';
import { makeStyles, Tooltip, Zoom } from '@material-ui/core';
import Truncate from 'react-truncate';

const useStyles = makeStyles({
  tooltipText: {
    wordWrap: 'break-word',
  },
});

export default function CeligoTruncate({
  ellipsis = '...',
  placement = 'top',
  lines = 1,
  delay = 500,
  children,
  dataPublic = false,
}) {
  const classes = useStyles();
  const [isTruncated, setIsTruncated] = useState(false);

  if (isTruncated) {
    return (
      <Tooltip
        title={<span className={classes.tooltipText}>{children}</span>}
        data-public={dataPublic}
        TransitionComponent={Zoom}
        placement={placement}
        enterDelay={delay}>
        <Truncate lines={lines} ellipsis={ellipsis} onTruncate={setIsTruncated}>
          {children}
        </Truncate>
      </Tooltip>
    );
  }

  return (
    <Truncate lines={lines} ellipsis={ellipsis} onTruncate={setIsTruncated}>
      {children}
    </Truncate>
  );
}
