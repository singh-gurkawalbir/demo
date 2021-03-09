import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import RegisterConnections from '../../../../../components/RegisterConnections';
import LoadResources from '../../../../../components/LoadResources';
import CeligoTable from '../../../../../components/CeligoTable';
import metadata from '../../../../../components/ResourceTable/connections/metadata';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import IconTextButton from '../../../../../components/IconTextButton';
import AddIcon from '../../../../../components/icons/AddIcon';
import ConnectionsIcon from '../../../../../components/icons/ConnectionsIcon';
import PanelHeader from '../../../../../components/PanelHeader';
import { isTradingPartnerSupported, generateNewId } from '../../../../../utils/resource';
import ConfigConnectionDebugger from '../../../../../components/drawer/ConfigConnectionDebugger';
import useSelectorMemo from '../../../../../hooks/selectors/useSelectorMemo';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    overflowX: 'auto',
  },
}));

const defaultFilter = { sort: {order: 'asc', orderBy: 'name'}};

export default function ConnectionsPanel({ integrationId, storeId }) {
  const classes = useStyles();
  const [showRegister, setShowRegister] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();
  const filterKey = `${integrationId}${`+${storeId}` || ''}+connections`;
  const tableConfig = useSelector(state => selectors.filter(state, filterKey)) || defaultFilter;
  const integration = useSelectorMemo(selectors.mkIntegrationAppSettings, integrationId);
  const connections = useSelector(state =>
    selectors.integrationAppConnectionList(
      state,
      integrationId,
      storeId,
      tableConfig
    )
  );

  const applications = [];

  connections.forEach(conn => {
    if (!(applications.includes(conn.type))) {
      applications.push(conn.assistant || conn.type);
    }
  });

  const permission = useSelector(
    state =>
      selectors.resourcePermissions(
        state,
        'integrations',
        integrationId,
        'connections'
      ),
    shallowEqual
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
    dispatch(actions.patchFilter(filterKey, defaultFilter));
  }, []);
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
      {showRegister && (
        <RegisterConnections
          integrationId={integrationId}
          onClose={() => setShowRegister(false)}
        />
      )}

      <PanelHeader title="Connections">
        <>
          {permission.create && (
            <IconTextButton
              onClick={() => {
                const newId = generateNewId();

                history.push(`${location.pathname}/add/connections/${newId}`);

                const patchSet = [
                  {
                    op: 'add',
                    path: '/_integrationId',
                    value: integrationId,
                  },
                  {
                    op: 'add',
                    path: '/applications',
                    value: applications,
                  },
                ];

                if (integration?._connectorId) {
                  patchSet.push({
                    op: 'add',
                    path: '/_connectorId',
                    value: integration._connectorId,
                  });
                  patchSet.push({
                    op: 'add',
                    path: '/newIA',
                    value: true,
                  });
                }

                dispatch(
                  actions.resource.patchStaged(newId, patchSet, 'value')
                );
              }}>
              <AddIcon /> Create connection
            </IconTextButton>
          )}
          {permission.register && (
            <IconTextButton onClick={() => setShowRegister(true)}>
              <ConnectionsIcon /> Register connections
            </IconTextButton>
          )}
        </>
      </PanelHeader>

      <LoadResources required resources="connections,flows,exports,imports">
        <CeligoTable
          data={connections}
          filterKey={filterKey}
          {...metadata}
          actionProps={{ integrationId, resourceType: 'connections', showTradingPartner,
          }}
        />
      </LoadResources>

      <ConfigConnectionDebugger />
    </div>
  );
}
