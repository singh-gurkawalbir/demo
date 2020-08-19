import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { makeStyles, Chip } from '@material-ui/core';
import { getIntegrationAppUrlName } from '../../../../../utils/integrationApps';
import { selectors } from '../../../../../reducers';
import InfoIconButton from '../../../../InfoIconButton';
import getRoutePath from '../../../../../utils/routePaths';

const useStyles = makeStyles(theme => ({
  root: {
    // display: 'flex',
    maxWidth: 300,
    wordWrap: 'break-word',
  },
  freeTag: {
    margin: theme.spacing(1),
    color: theme.palette.background.paper,
  },
  flowLink: {
    display: 'inline',
    transition: theme.transitions.create('color'),
    '&:hover': {
      color: theme.palette.primary.dark,
    },
  },
}));

export default function NameCell({
  name,
  description,
  isFree,
  flowId,
  isIntegrationApp,
  integrationId,
  storeId,
}) {
  const classes = useStyles();
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
  const flowName = name || `Unnamed (id: ${flowId})`;
  const flowBuilderPathName = isDataLoader ? 'dataLoader' : 'flowBuilder';

  let flowBuilderTo;

  if (isIntegrationApp) {
    if (storeId) {
      flowBuilderTo = getRoutePath(`/integrationapps/${appName}/${integrationId}/child/${storeId}/${flowBuilderPathName}/${flowId}`);
    } else {
      flowBuilderTo = getRoutePath(`/integrationapps/${appName}/${integrationId}/${flowBuilderPathName}/${flowId}`);
    }
  } else {
    flowBuilderTo = getRoutePath(`/integrations/${integrationId || 'none'}/${flowBuilderPathName}/${flowId}`);
  }

  return (
    <div className={classes.root}>
      <Link to={flowBuilderTo}>{flowName}</Link>

      <InfoIconButton info={description} size="xs" />

      {isFree && (
        <Chip
          label="Free"
          color="primary"
          size="small"
          className={classes.freeTag}
        />
      )}
    </div>
  );
}
