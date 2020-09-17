import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
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
}));

export default function RunCell({
  flowId,
  integrationId,
}) {
  const classes = useStyles();
  const match = useRouteMatch();
  const data = useSelector(state => {
    const integrationErrors = selectors.errorMap(state, integrationId);

    if (integrationErrors && integrationErrors.data) {
      return integrationErrors.data[flowId];
    }

    return '';
  });

  if (!data) {
    return null;
  }

  return (
    <div className={classes.root}>
      <span className={classes.errorStatus}>
        <StatusCircle variant="error" size="small" />
        <Link to={`${match.url}/${flowId}/errorsList`}>{data} errors</Link>
      </span>
    </div>
  );
}
