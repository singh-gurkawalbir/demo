import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
// import Typography from '@material-ui/core/Typography';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../../reducers';
import StatusButton from '../../../../Buttons/StatusButton';

const useStyles = makeStyles(theme => ({
  errorStatusLink: {
    color: theme.palette.primary.main,
    '&:hover': {
      color: theme.palette.primary.light,
    },
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

  if (flowErrorCount) {
    return (
      <StatusButton variant="error" size="mini">
        <Link className={classes.errorStatusLink} to={`${match.url}/${flowId}/errorsList`}>{flowErrorCount} {flowErrorCount === 1 ? 'error' : 'errors'}</Link>
      </StatusButton>
    );
  }

  return (
    <StatusButton variant="success" size="mini">
      success
    </StatusButton>
  );
}
