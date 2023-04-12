import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import { generateNewId, isTradingPartnerSupported } from '../../../../../utils/resource';
import RegisterConnections from '../../../../../components/RegisterConnections';
import LoadResources from '../../../../../components/LoadResources';
import CeligoTable from '../../../../../components/CeligoTable';
import metadata from '../../../../../components/ResourceTable/connections/metadata';
import AddIcon from '../../../../../components/icons/AddIcon';
import ConnectionsIcon from '../../../../../components/icons/ConnectionsIcon';
import PanelHeader from '../../../../../components/PanelHeader';
import ConfigConnectionDebugger from '../../../../../components/drawer/ConfigConnectionDebugger';
import useSelectorMemo from '../../../../../hooks/selectors/useSelectorMemo';
import { TextButton } from '../../../../../components/Buttons';
import ActionGroup from '../../../../../components/ActionGroup';
import { drawerPaths, buildDrawerUrl } from '../../../../../utils/rightDrawer';
import infoText from '../infoText';
import customCloneDeep from '../../../../../utils/customCloneDeep';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    overflowX: 'auto',
  },
}));

export default function ConnectionsPanel({ integrationId, childId }) {
  const isStandalone = integrationId === 'none';
  const _integrationId = childId || integrationId;
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const [showRegister, setShowRegister] = useState(false);
  const location = useLocation();
  const filterKey = `${_integrationId}+connections`;
  const integration = useSelectorMemo(selectors.makeResourceSelector, 'integrations', integrationId);
  const tableConfig = useSelector(state => selectors.filter(state, filterKey));
  const connections = useSelector(state =>
    selectors.integrationConnectionList(state, integrationId, childId, tableConfig)
  );
  const permission = useSelector(state =>
    selectors.resourcePermissions(
      state,
      'integrations',
      _integrationId,
      'connections'
    )
  );
  const applications = [];

  if (childId) {
    connections.forEach(conn => {
      if (!(applications.includes(conn.type))) {
        applications.push(conn.assistant || conn.type);
      }
    });
  }

  const [tempId, setTempId] = useState(null);
  const newResourceId = useSelector(state =>
    selectors.createdResourceId(state, tempId)
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
    dispatch(actions.patchFilter(filterKey, {sort: { order: 'asc', orderBy: 'name' }}));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (permission.register && newResourceId && !isStandalone) {
      dispatch(
        actions.connection.requestRegister([newResourceId], _integrationId)
      );
    }
  }, [dispatch, _integrationId, newResourceId, isStandalone, permission.register]);

  useEffect(() => {
    dispatch(actions.resource.connections.refreshStatus(_integrationId));
    // For connections resource table, we need to poll the connection status and queueSize

    dispatch(actions.app.polling.start(actions.resource.connections.refreshStatus(_integrationId), 10 * 1000));

    return () => {
      dispatch(actions.app.polling.stopSpecificPollProcess(actions.resource.connections.refreshStatus(_integrationId)));
    };
  }, [dispatch, _integrationId]);

  const handleClick = useCallback(e => {
    e.preventDefault();

    const newId = generateNewId();

    setTempId(newId);
    history.push(buildDrawerUrl({
      path: drawerPaths.RESOURCE.ADD,
      baseUrl: location.pathname,
      params: { resourceType: 'connections', id: newId },
    }));

    if (!isStandalone) {
      const patchSet = [
        {
          op: 'add',
          path: '/_integrationId',
          value: _integrationId,
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

      if (childId) {
        patchSet.push({
          op: 'add',
          path: '/applications',
          value: applications,
        });
      }

      dispatch(
        actions.resource.patchStaged(newId, patchSet)
      );
    }
  }, [_integrationId, applications, childId, dispatch, history, integration?._connectorId, isStandalone, location.pathname]);

  return (
    <div className={classes.root}>
      {showRegister && (
        <RegisterConnections
          integrationId={_integrationId}
          onClose={() => setShowRegister(false)}
        />
      )}

      <PanelHeader title="Connections" infoText={infoText.Connections} contentId="connectionsIntegration">
        <ActionGroup>
          {permission.create && (
          <TextButton
            startIcon={<AddIcon />}
            onClick={handleClick}>
            Create connection
          </TextButton>
          )}
          {permission.register && !isStandalone && (
          <TextButton
            startIcon={<ConnectionsIcon />}
            onClick={() => setShowRegister(true)}>
            Register connections
          </TextButton>
          )}
        </ActionGroup>
      </PanelHeader>

      <LoadResources required integrationId={integrationId} resources="connections">
        <CeligoTable
          data={customCloneDeep(connections)}
          filterKey={filterKey}
          {...metadata}
          actionProps={{ integrationId: _integrationId, resourceType: 'connections', showTradingPartner,
          }}
        />
      </LoadResources>

      <ConfigConnectionDebugger />
    </div>
  );
}
