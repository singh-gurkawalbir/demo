import React, {useState, useCallback} from 'react';
import { makeStyles, Button, TableCell } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  errorButton: {
    color: theme.palette.error.main,
    float: 'right',
    padding: 0,
    minWidth: 'unset',
    '&:hover': {
      color: `${theme.palette.error.dark} !important`,
    },
  },
  view: {
    position: 'relative',
    zIndex: 1000,
    width: 0,
    left: theme.spacing(1),
  },
}));

export default function ErrorCountCell({count, isError, onClick, isJobInProgress, className}) {
  const [showLink, setShowLink] = useState(false);
  const classes = useStyles();
  const handleMouseEnter = useCallback(() => setShowLink(true), []);
  const handleMouseLeave = useCallback(() => setShowLink(false), []);

  return (
    <TableCell
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={className}>
      {showLink && !isJobInProgress && count > 0 ? (
        <Button
          data-test={`view-job-${isError ? 'error' : 'resolved'}`}
          variant="text"
          color="primary"
          className={isError ? classes.errorButton : undefined}
          onClick={onClick}>
          {count} <span className={classes.view}>View</span>
        </Button>
      ) :
        count}
    </TableCell>
  );
}
