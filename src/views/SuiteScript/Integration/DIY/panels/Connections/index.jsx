import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../../../reducers';
import PanelHeader from '../../../../../../components/PanelHeader';
import LoadSuiteScriptResources from '../../../../../../components/SuiteScript/LoadResources';
import CeligoTable from '../../../../../../components/CeligoTable';
import metadata from '../../../../../../components/ResourceTable/suiteScript/connections/metadata';
import customCloneDeep from '../../../../../../utils/customCloneDeep';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    overflowX: 'auto',
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
          data={customCloneDeep(connections)}
          {...metadata}
          actionProps={{ ssLinkedConnectionId, integrationId }}
        />
      </LoadSuiteScriptResources>
    </div>
  );
}
