import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { getIntegrationAppUrlName } from '../../../../../utils/integrationApps';
import { selectors } from '../../../../../reducers';
import getRoutePath from '../../../../../utils/routePaths';
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
  isIntegrationApp,
  childId,
}) {
  const classes = useStyles();
  const data = useSelector(state => {
    const integrationErrors = selectors.errorMap(state, integrationId);

    if (integrationErrors && integrationErrors.data) {
      return integrationErrors.data[flowId];
    }

    return '';
  });

  const isDataLoader = useSelector(state =>
    selectors.isDataLoader(state, flowId)
  );
  // TODO: All this logic should be in a selector: selectors.integrationAppName(state, id)
  const appName = useSelector(state => {
    if (!isIntegrationApp) return;

    const integration = selectors.resource(
      state,
      'integrations',
      integrationId
    );

    if (integration && integration.name) {
      return getIntegrationAppUrlName(integration.name);
    }
  });
  const flowBuilderPathName = isDataLoader ? 'dataLoader' : 'flowBuilder';

  let flowBuilderTo;

  if (isIntegrationApp) {
    if (childId) {
      flowBuilderTo = getRoutePath(`/integrationapps/${appName}/${integrationId}/child/${childId}/${flowBuilderPathName}/${flowId}`);
    } else {
      flowBuilderTo = getRoutePath(`/integrationapps/${appName}/${integrationId}/${flowBuilderPathName}/${flowId}`);
    }
  } else {
    flowBuilderTo = getRoutePath(`/integrations/${integrationId || 'none'}/${flowBuilderPathName}/${flowId}`);
  }
  if (!data) {
    return null;
  }

  return (
    <div className={classes.root}>
      <span className={classes.errorStatus}>
        <StatusCircle variant="error" size="small" />
        <Link to={flowBuilderTo}>{data} errors</Link>
      </span>
    </div>
  );
}
