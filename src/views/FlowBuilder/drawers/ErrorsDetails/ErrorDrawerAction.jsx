import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import { makeStyles, Divider, Typography } from '@material-ui/core';
import { selectors } from '../../../../reducers';
import TextToggle from '../../../../components/TextToggle';
import Spinner from '../../../../components/Spinner';
import ErrorActionStatus from './ErrorActionStatus';

const useStyles = makeStyles(theme => ({
  divider: {
    width: 1,
    height: 24,
    margin: theme.spacing(0.5, 1, 0.5, 0),
    spinnerWrapper: {
      margin: theme.spacing(0, 1),
    },
  },
  spinner: {
    marginRight: theme.spacing(1),
  },
  status: {
    color: theme.palette.secondary.main,
  },
  retryContainer: {
    flexGrow: 100,
    alignItems: 'center',
    display: 'flex',
  },
  errorDrawerActionToggle: {
    '& > button': {
      whiteSpace: 'nowrap',
    },
  },
}));

export default function ErrorDrawerAction({ flowId, errorType, setErrorType }) {
  const classes = useStyles();
  const match = useRouteMatch();
  const { resourceId } = match?.params || {};
  const errorTypes = [
    { label: 'Open errors', value: 'open' },
    { label: 'Resolved errors', value: 'resolved' },
  ];
  const retryStatus = useSelector(
    state => selectors.retryStatus(state, flowId, resourceId)
  );

  const handleErrorTypeChange = useCallback(() => {
    setErrorType(errorType === 'open' ? 'resolved' : 'open');
  }, [errorType, setErrorType]);

  return (
    <>
      { retryStatus === 'inProgress' && (
      <div className={classes.retryContainer}>
        <Divider orientation className={classes.divider} />
        <Spinner size={16} className={classes.spinner} />
        <Typography variant="body2" component="div" className={classes.status}>
          Retrying errors...
        </Typography>
      </div>
      )}
      { retryStatus === 'completed' && (
      <div className={classes.retryContainer}>
        <Divider orientation className={classes.divider} />
        <Typography variant="body2" component="div" className={classes.status}>
          Retrying complete
        </Typography>
      </div>
      )}
      {
        resourceId && (
          <ErrorActionStatus flowId={flowId} resourceId={resourceId} />
        )
      }
      <TextToggle
        value={errorType}
        onChange={handleErrorTypeChange}
        exclusive
        className={classes.errorDrawerActionToggle}
        options={errorTypes}
      />
    </>
  );
}
