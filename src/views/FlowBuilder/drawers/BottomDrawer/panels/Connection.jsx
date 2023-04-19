import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import LoadResources from '../../../../../components/LoadResources';
import CeligoTable from '../../../../../components/CeligoTable';
import metadata from '../../../../../components/ResourceTable/connections/metadata';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import {
  isTradingPartnerSupported,
} from '../../../../../utils/resource';
import useSelectorMemo from '../../../../../hooks/selectors/useSelectorMemo';
import customCloneDeep from '../../../../../utils/customCloneDeep';

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

    dispatch(actions.app.polling.start(actions.resource.connections.refreshStatus(integrationId), 10 * 1000));

    return () => {
      dispatch(actions.app.polling.stopSpecificPollProcess(actions.resource.connections.refreshStatus(integrationId)));
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
      <LoadResources integrationId={integrationId} required resources="connections">
        <CeligoTable
          data={customCloneDeep(flowConnections)}
          filterKey="connections"
          {...metadata}
          actionProps={actionProps}
        />
      </LoadResources>
    </div>
  );
}
