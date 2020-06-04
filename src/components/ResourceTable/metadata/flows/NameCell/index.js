import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { makeStyles, Chip } from '@material-ui/core';
import { getIntegrationAppUrlName } from '../../../../../utils/integrationApps';
import * as selectors from '../../../../../reducers';
import InfoIconButton from '../../../../InfoIconButton';

const useStyles = makeStyles(theme => ({
  root: {
    // display: 'flex',
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
  const flowBuilderTo = isIntegrationApp
    ? `/pg/integrationApps/${appName}/${integrationId}/${flowBuilderPathName}/${flowId}`
    : `${flowBuilderPathName}/${flowId}`;

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
