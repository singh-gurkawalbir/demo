import React from 'react';
import { useSelector } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import LoadResources from '../../../../../../components/SuiteScript/LoadResources';
import CeligoTable from '../../../../../../components/CeligoTable';
import metadata from '../../../../../../components/ResourceTable/suiteScript/connections/metadata';
import { selectors } from '../../../../../../reducers';
import customCloneDeep from '../../../../../../utils/customCloneDeep';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(0),
  },
}));

export default function ConnectionPanel({ ssLinkedConnectionId, flowId }) {
  const integrationId = useSelector(state =>
    selectors.suiteScriptResource(state, {
      resourceType: 'flows',
      id: flowId,
      ssLinkedConnectionId,
    })._integrationId
  );
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
          data={customCloneDeep(flowConnections)}
          {...metadata}
          actionProps={{ ssLinkedConnectionId, integrationId }}
        />
      </LoadResources>
    </div>
  );
}
