import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { getTextAfterCount } from '../../../utils/string';
import StatusCircle from '../../StatusCircle';
import CeligoDivider from '../../CeligoDivider';

const useStyles = makeStyles(theme => ({
  conflictStatus: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: theme.spacing(2),
  },
}));

export default function ConflictStatus({count}) {
  const classes = useStyles();

  return (
    <>
      <CeligoDivider position="left" />
      <div className={classes.conflictStatus}>
        <StatusCircle variant={count ? 'error' : 'success'} size="mini" />
        <span>{getTextAfterCount('conflict', count)}</span>
      </div>
    </>
  );
}
