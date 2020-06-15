import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import * as selectors from '../../../../../reducers';
import { generateNewId } from '../../../../../utils/resource';
import RegisterConnections from '../../../../../components/RegisterConnections';
import LoadResources from '../../../../../components/LoadResources';
import CeligoTable from '../../../../../components/CeligoTable';
import metadata from '../../../../../components/ResourceTable/metadata/connections';
import IconTextButton from '../../../../../components/IconTextButton';
import AddIcon from '../../../../../components/icons/AddIcon';
import ConnectionsIcon from '../../../../../components/icons/ConnectionsIcon';
import PanelHeader from '../../../../../components/PanelHeader';
import actions from '../../../../../actions';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    overflowX: 'scroll',
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
  const [tempId, setTempId] = useState(null);
  const newResourceId = useSelector(state =>
    selectors.createdResourceId(state, tempId)
  );

  useEffect(() => {
    if (newResourceId) {
      dispatch(
        actions.connection.requestRegister([newResourceId], _integrationId)
      );
    }
  }, [dispatch, _integrationId, newResourceId]);

  useEffect(() => {
    dispatch(actions.resource.connections.refreshStatus(_integrationId));
    // For connections resource table, we need to poll the connection status and queueSize
    const interval = setInterval(() => {
      dispatch(actions.resource.connections.refreshStatus(_integrationId));
    }, 10 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, [dispatch, _integrationId]);

  return (
    <div className={classes.root}>
      {showRegister && (
        <RegisterConnections
          integrationId={_integrationId}
          onClose={() => setShowRegister(false)}
        />
      )}

      <PanelHeader title="Connections">
        <>
          {permission.create && (
            <IconTextButton
              onClick={() => {
                const newId = generateNewId();

                setTempId(newId);
                history.push(`${location.pathname}/add/connections/${newId}`);

                const patchSet = [
                  {
                    op: 'add',
                    path: '/_integrationId',
                    value: _integrationId,
                  },
                ];

                dispatch(
                  actions.resource.patchStaged(newId, patchSet, 'value')
                );
              }}>
              <AddIcon /> Create connection
            </IconTextButton>
          )}
          {permission.register && !isStandalone && (
            <IconTextButton onClick={() => setShowRegister(true)}>
              <ConnectionsIcon /> Register connections
            </IconTextButton>
          )}
        </>
      </PanelHeader>

      <LoadResources required resources="connections">
        <CeligoTable
          data={connections}
          filterKey={filterKey}
          {...metadata}
          actionProps={{ integrationId: _integrationId }}
        />
      </LoadResources>
    </div>
  );
}
