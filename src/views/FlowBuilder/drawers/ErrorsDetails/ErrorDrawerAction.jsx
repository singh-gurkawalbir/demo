import React from 'react';
import { useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import { makeStyles, Divider, Typography } from '@material-ui/core';
import { selectors } from '../../../../reducers';
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

export default function ErrorDrawerAction({ flowId, onChange }) {
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
          <span>Retrying complete. </span>
          <span onClick={() => onChange('retries')}>View results</span>
        </Typography>
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
