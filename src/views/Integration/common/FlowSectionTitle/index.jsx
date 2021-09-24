import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { selectors } from '../../../../reducers';
import Status from '../../../../components/Buttons/Status';
import StatusCircle from '../../../../components/StatusCircle';

const useStyles = makeStyles(theme => ({
  errorStatus: {
    justifyContent: 'center',
    height: 'unset',
    display: 'flex',
    alignItems: 'center',
    fontSize: '12px',
  },
  gridContainer: {
    display: 'grid',
    gridColumnGap: theme.spacing(1),
    gridTemplateColumns: `auto ${theme.spacing(7)}px`,
    position: 'relative',
    '& > div:first-child': {
      wordBreak: 'break-word',
    },
  },
}));

export default function FlowSectionTitle({ title, errorCount = 0 }) {
  const classes = useStyles();
  const isUserInErrMgtTwoDotZero = useSelector(state =>
    selectors.isOwnerUserInErrMgtTwoDotZero(state)
  );

  const errorStatus = useMemo(() => {
    if (errorCount === 0) {
      return <StatusCircle size="mini" variant="success" />;
    }

    return (
      <Status size="mini" variant="error" >
        <span>{errorCount > 9999 ? '9999+' : errorCount}</span>
      </Status>
    );
  }, [errorCount]);

  if (!isUserInErrMgtTwoDotZero) {
    return title;
  }

  return (
    <span className={classes.gridContainer}>
      <span> { title }</span>
      <span> {errorStatus} </span>
    </span>
  );
}
