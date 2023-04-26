import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import { Divider, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { Spinner } from '@celigo/fuse-ui';
import { selectors } from '../../../../reducers';
import ErrorActionStatus from './ErrorActionStatus';
import TextButton from '../../../../components/Buttons/TextButton';
import { FILTER_KEYS } from '../../../../utils/errorManagement';

const useStyles = makeStyles(theme => ({
  status: {
    color: theme.palette.secondary.main,
    fontSize: 15,
  },
  retryContainer: {
    flexGrow: 100,
    alignItems: 'center',
    display: 'flex',
    minWidth: 230,
    alignSelf: 'flex-start',
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
  viewResults: {
    padding: theme.spacing(0, 0.5),
  },
}));

export default function ErrorDrawerAction({ flowId, onChange, errorType }) {
  const classes = useStyles();
  const match = useRouteMatch();
  const { resourceId } = match?.params || {};
  const retryStatus = useSelector(
    state => selectors.retryStatus(state, flowId, resourceId)
  );
  const handleClick = useCallback(() => onChange(FILTER_KEYS.RETRIES), [onChange]);

  return (
    <>
      { true && (
      <div className={classes.retryContainer}>
        <Divider orientation="vertical" className={classes.divider} />
        <Spinner size="small" sx={{ mr: 0.5, display: 'flex'}} />
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
          <TextButton
            size="large" bold color="primary" className={classes.viewResults}
            onClick={handleClick}>
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
