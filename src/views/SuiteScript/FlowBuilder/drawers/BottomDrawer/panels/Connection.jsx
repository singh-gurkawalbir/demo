import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import LoadResources from '../../../../../../components/SuiteScript/LoadResources';
import CeligoTable from '../../../../../../components/CeligoTable';
import metadata from '../../../../../../components/ResourceTable/suiteScript/connections/metadata';
import { selectors } from '../../../../../../reducers';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(0),
  },
}));

export default function ConnectionPanel({ ssLinkedConnectionId, flowId }) {
  const integrationId = useSelector(state => selectors.resource(state, 'flows', flowId)._integrationId);
  const classes = useStyles();
  const flowConnections = useSelector(
    state =>
      selectors.suiteScriptFlowConnectionList(state, {
        ssLinkedConnectionId,
        flowId,
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
