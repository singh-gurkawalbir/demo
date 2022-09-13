import React from 'react';
import { useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import { makeStyles, Divider, Typography } from '@material-ui/core';
import { selectors } from '../../../../reducers';
import Spinner from '../../../../components/Spinner';
import ErrorActionStatus from './ErrorActionStatus';
import TextButton from '../../../../components/Buttons/TextButton';
import { FILTER_KEYS } from '../../../../utils/errorManagement';

const useStyles = makeStyles(theme => ({
  spinner: {
    marginRight: theme.spacing(0.5),
    display: 'flex',
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
  divider: {
    height: theme.spacing(3),
    marginRight: theme.spacing(2),
  },
}));

export default function ErrorDrawerAction({ flowId, onChange, errorType }) {
  const classes = useStyles();
  const match = useRouteMatch();
  const { resourceId } = match?.params || {};
  const retryStatus = useSelector(
    state => selectors.retryStatus(state, flowId, resourceId)
  );

  return (
    <>
      { retryStatus === 'inProgress' && (
      <div className={classes.retryContainer}>
        <Divider orientation="vertical" className={classes.divider} />
        <Spinner size={16} className={classes.spinner} />
        <Typography variant="body2" component="div" className={classes.status}>
          Retrying errors...
        </Typography>
      </div>
      )}
      { retryStatus === 'completed' && (
      <div className={classes.retryContainer}>
        <Divider orientation="vertical" className={classes.divider} />
        <Typography variant="body2" component="div" className={classes.status}>
          Retry completed.
        </Typography>
        {errorType !== FILTER_KEYS.RETRIES ? (
          <TextButton size="large" color="primary" onClick={() => onChange(FILTER_KEYS.RETRIES)}>
            View results
          </TextButton>
        ) : ''}
      </div>
      )}
      {
        resourceId && (
          <ErrorActionStatus flowId={flowId} resourceId={resourceId} />
        )
      }
    </>
  );
}
