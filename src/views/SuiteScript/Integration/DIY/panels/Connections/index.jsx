import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import * as selectors from '../../../../../../reducers';
import PanelHeader from '../../../../../../components/PanelHeader';
import LoadSuiteScriptResources from '../../../../../../components/SuiteScript/LoadResources';
import CeligoTable from '../../../../../../components/CeligoTable';
import metadata from '../../../../../../components/ResourceTable/metadata/suiteScript/connections';


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
          {...metadata}
          actionProps={{ ssLinkedConnectionId, integrationId }}
        />
      </LoadSuiteScriptResources>
    </div>
  );
}
