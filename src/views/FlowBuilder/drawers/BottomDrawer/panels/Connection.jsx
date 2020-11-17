import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import LoadResources from '../../../../../components/LoadResources';
import CeligoTable from '../../../../../components/CeligoTable';
import metadata from '../../../../../components/ResourceTable/connections/metadata';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import {
  isTradingPartnerSupported,
} from '../../../../../utils/resource';
import useSelectorMemo from '../../../../../hooks/selectors/useSelectorMemo';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(0),
  },
}));

export default function ConnectionPanel({ flowId }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const integrationId = useSelector(state => selectors.resource(state, 'flows', flowId)?._integrationId);
  const flowConnections = useSelectorMemo(selectors.mkFlowConnectionList, flowId);
  const licenseActionDetails = useSelector(state =>
    selectors.platformLicenseWithMetadata(state)
  );
  const accessLevel = useSelector(
    state => selectors.resourcePermissions(state).accessLevel
  );
  const environment = useSelector(
    state => selectors.userPreferences(state).environment
  );
  const showTradingPartner = isTradingPartnerSupported({licenseActionDetails, accessLevel, environment});

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

  const actionProps = useMemo(() => ({
    type: 'flowBuilder',
    resourceType: 'connections',
    integrationId,
    showTradingPartner,
  }), [integrationId, showTradingPartner]);

  return (
    <div className={classes.root}>
      <LoadResources required resources="connections">
        <CeligoTable
          data={flowConnections}
          filterKey="connections"
          {...metadata}
          actionProps={actionProps}
        />
      </LoadResources>
    </div>
  );
}
