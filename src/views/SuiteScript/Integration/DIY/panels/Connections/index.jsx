import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import { Link, useRouteMatch } from 'react-router-dom';
import * as selectors from '../../../../../../reducers';
import PanelHeader from '../../../../../../components/PanelHeader';
import LoadSuiteScriptResources from '../../../../../../components/SuiteScript/LoadResources';
import CeligoTable from '../../../../../../components/CeligoTable';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    overflowX: 'scroll',
  },
}));

export default function ConnectionsPanel({
  ssLinkedConnectionId,
  integrationId,
}) {
  const classes = useStyles();
  const match = useRouteMatch();
  const connections = useSelector(
    state =>
      selectors.suiteScriptIntegrationConnectionList(state, {
        ssLinkedConnectionId,
        integrationId,
      }),
    (left, right) => left.length === right.length
  );

  return (
    <div className={classes.root}>
      <PanelHeader title="Connections" />
      <LoadSuiteScriptResources
        required
        ssLinkedConnectionId={ssLinkedConnectionId}
        resources="flows,connections"
        integrationId={integrationId}>
        <CeligoTable
          data={connections}
          columns={[
            {
              heading: 'Name',
              value: r => (
                <Link
                  // onClick={onClick}
                  // if a user clicks to open a resource drawer (when the drawer is already opened),
                  // we should replace the top of the history stack
                  // so the back button does not need to traverse over
                  // all resources a user clicked on. This logic may change, but I think
                  // is better for UX and a good starting position to take.
                  // We "know (guess) that a drawer is already opened if the route path is not
                  // an exact match (url already contains drawer route segment)"
                  // replace={!match.isExact}
                  to={`${match.url}/edit/connections/${r._id}`}>
                  {r.name}
                </Link>
              ),
            },
          ]}
        />
      </LoadSuiteScriptResources>
    </div>
  );
}
