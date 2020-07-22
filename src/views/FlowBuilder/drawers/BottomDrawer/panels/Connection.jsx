import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import LoadResources from '../../../../../components/LoadResources';
import CeligoTable from '../../../../../components/CeligoTable';
import metadata from '../../../../../components/ResourceTable/metadata/connections';
import * as selectors from '../../../../../reducers';
import actions from '../../../../../actions';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(0),
  },
}));

export default function ConnectionPanel({ flow }) {
  const { _integrationId: integrationId } = flow;
  const classes = useStyles();
  const dispatch = useDispatch();
  const flowConnections = useSelector(state =>
    selectors.flowConnectionList(state, flow)
  );

  useEffect(() => {
    dispatch(actions.resource.connections.refreshStatus(integrationId));
    // For connections resource table, we need to poll the connection status and queueSize
    const interval = setInterval(() => {
      dispatch(actions.resource.connections.refreshStatus(integrationId));
    }, 10 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, [dispatch, integrationId]);

  return (
    <div className={classes.root}>
      <LoadResources required resources="connections">
        <CeligoTable
          data={flowConnections}
          filterKey="connections"
          {...metadata}
          actionProps={{
            type: 'flowBuilder',
            resourceType: 'connections',
            integrationId,
          }}
        />
      </LoadResources>
    </div>
  );
}
