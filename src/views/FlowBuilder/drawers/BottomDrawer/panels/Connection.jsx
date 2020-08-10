import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import LoadResources from '../../../../../components/LoadResources';
import CeligoTable from '../../../../../components/CeligoTable';
import metadata from '../../../../../components/ResourceTable/metadata/connections';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import {
  isTradingPartnerSupported,
} from '../../../../../utils/resource';

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
            showTradingPartner,
          }}
        />
      </LoadResources>
    </div>
  );
}
