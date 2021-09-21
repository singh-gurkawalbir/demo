import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { selectors } from '../../../../reducers';
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
    gridColumnGap: '10px',
    gridTemplateColumns: `auto ${theme.spacing(5)}px`,
    position: 'relative',
    '& > div:first-child': {
      wordBreak: 'break-word',
    },
    '& > div:last-child': {
      position: 'relative',
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
      <div>
        <StatusCircle size="mini" variant="error" />
        <span>{errorCount > 9999 ? '9999+' : errorCount}</span>
      </div>
    );
  }, [errorCount]);

  if (!isUserInErrMgtTwoDotZero) {
    return title;
  }

  return (
    <div className={classes.gridContainer}>
      <div> { title }</div>
      <div> {errorStatus} </div>
    </div>
  );
}
