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
    wordWrap: 'break-word',
  },
  errorStatus: {
    justifyContent: 'center',
    height: 'unset',
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
    fontSize: '14px',
  },
  success: {
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
  },
}));

export default function RunCell({
  flowId,
  integrationId,
}) {
  const classes = useStyles();
  const match = useRouteMatch();
  const flowErrorCount = useSelector(state => {
    const integrationErrors = selectors.errorMap(state, integrationId);

    if (integrationErrors && integrationErrors.data) {
      return integrationErrors.data[flowId];
    }

    return '';
  });

  const hasFlowJobs = useSelector(state => {
    const latestFlowJobs = selectors.latestJobMap(state, integrationId)?.data || [];

    return !!latestFlowJobs.find(job => job._flowId === flowId);
  });

  if (flowErrorCount) {
    return (
      <div className={classes.root}>
        <span className={classes.errorStatus}>
          <StatusCircle variant="error" size="small" />
          <Link to={`${match.url}/${flowId}/errorsList`}>{flowErrorCount} errors</Link>
        </span>
      </div>
    );
  }
  // when there are no errors and has flow jobs , that implies last flow run is success
  if (hasFlowJobs) {
    // TODO @Raghu: Check on what cases, we need to show success
    return (
      <div className={classes.root}>
        <span className={classes.success}>
          <StatusCircle variant="success" size="small" />
          <Typography variant="body2" component="span"> success </Typography>
        </span>
      </div>
    );
  }

  return null;
}

