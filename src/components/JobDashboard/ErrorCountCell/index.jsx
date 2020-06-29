import clsx from 'clsx';
import React, {useState, useCallback} from 'react';
import { makeStyles, TableCell } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  link: {
    cursor: 'pointer',
  },
  resolved: {
    color: theme.palette.primary.main,
  },
}));

export default function ErrorCountCell({count, isError, onClick, isJobInProgress, className}) {
  const [showLink, setShowLink] = useState(false);
  const classes = useStyles();
  const handleMouseEnter = useCallback(() => {
    if (!isJobInProgress && count > 0) setShowLink(true);
  }, [count, isJobInProgress]);
  const handleMouseLeave = useCallback(() => setShowLink(false), []);

  return (
    <TableCell
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-test={`view-job-${isError ? 'error' : 'resolved'}`}
      onClick={onClick}
      className={clsx(className, {
        [classes.resolved]: showLink && !isError,
        [classes.link]: showLink
      })}>
      {showLink ? 'View' : count}
    </TableCell>
  );
}
