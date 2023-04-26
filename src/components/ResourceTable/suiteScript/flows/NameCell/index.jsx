import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import { selectors } from '../../../../../reducers';
import getRoutePath from '../../../../../utils/routePaths';

const useStyles = makeStyles(theme => ({
  root: {
    // display: 'flex',
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
  ssLinkedConnectionId,
  flow,
}) {
  const classes = useStyles();
  const integration = useSelector(state =>
    selectors.suiteScriptResource(state, {
      resourceType: 'integrations',
      id: flow._integrationId,
      ssLinkedConnectionId,
    })
  );
  const flowName = flow.ioFlowName || flow.name || `Unnamed (id: ${flow._id})`;
  const flowBuilderTo = integration._connectorId
    ? getRoutePath(`/suitescript/${ssLinkedConnectionId}/integrationapps/${integration.urlName}/${flow._integrationId}/flowBuilder/${flow._id}`)
    : getRoutePath(`/suitescript/${ssLinkedConnectionId}/integrations/${flow._integrationId}/flowBuilder/${flow._id}`);

  return (
    <div className={classes.root}>
      <Link to={flowBuilderTo}>{flowName}</Link>
    </div>
  );
}
