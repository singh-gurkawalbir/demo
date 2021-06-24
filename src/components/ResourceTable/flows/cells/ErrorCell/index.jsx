import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../../reducers';
import StatusCircle from '../../../../StatusCircle';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 300,
    minWidth: 100,
    wordBreak: 'break-word',
  },
  errorStatus: {
    justifyContent: 'center',
    height: 'unset',
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
    fontSize: '14px',
  },
  errorStatusLink: {
    color: theme.palette.primary.main,
    '&:hover': {
      color: theme.palette.primary.light,
    },
  },
  success: {
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
  },
  label: {
    position: 'relative',
    top: 2,
  },
}));

export default function RunCell({
  flowId,
  integrationId,
}) {
  const classes = useStyles();
  const match = useRouteMatch();
  const flowErrorCount = useSelector(state => {
    const integrationErrorsMap = selectors.openErrorsMap(state, integrationId);

    return integrationErrorsMap?.[flowId] || '';
  });

  if (flowErrorCount) {
    return (
      <div className={classes.root}>
        <span className={classes.errorStatus}>
          <StatusCircle variant="error" size="mini" />
          <Link className={classes.errorStatusLink} to={`${match.url}/${flowId}/errorsList`}>{flowErrorCount} {flowErrorCount === 1 ? 'error' : 'errors'}</Link>
        </span>
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <span className={classes.success}>
        <StatusCircle variant="success" size="mini" />
        <Typography variant="body2" component="span" className={classes.label}> success </Typography>
      </span>
    </div>
  );
}
