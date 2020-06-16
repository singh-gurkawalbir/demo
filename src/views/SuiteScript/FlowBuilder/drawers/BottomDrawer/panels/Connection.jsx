import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import LoadResources from '../../../../../../components/SuiteScript/LoadResources';
import CeligoTable from '../../../../../../components/CeligoTable';
import metadata from '../../../../../../components/ResourceTable/metadata/suiteScript/connections';
import * as selectors from '../../../../../../reducers';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(0),
  },
}));

export default function ConnectionPanel({ ssLinkedConnectionId, flow }) {
  const { _integrationId: integrationId } = flow;
  const classes = useStyles();
  const flowConnections = useSelector(
    state =>
      selectors.suiteScriptIntegrationConnectionList(state, {
        ssLinkedConnectionId,
        integrationId,
      }),
    (left, right) => left.length === right.length
  );

  return (
    <div className={classes.root}>
      <LoadResources
        required
        ssLinkedConnectionId={ssLinkedConnectionId}
        integrationId={integrationId}
        resources="connections">
        <CeligoTable
          data={flowConnections}
          {...metadata}
          actionProps={{ ssLinkedConnectionId, integrationId }}
        />
      </LoadResources>
    </div>
  );
}
