import { useState, Fragment, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
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

export default function ConnectionsPanel({ integrationId }) {
  const isStandalone = integrationId === 'none';
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const [showRegister, setShowRegister] = useState(false);
  const location = useLocation();
  const filterKey = `${integrationId}+connections`;
  const tableConfig = useSelector(state => selectors.filter(state, filterKey));
  const connections = useSelector(state =>
    selectors.integrationConnectionList(state, integrationId, tableConfig)
  );
  const integration = useSelector(state =>
    selectors.resource(state, 'integrations', integrationId)
  );
  const permission = useSelector(state =>
    selectors.resourcePermissions(
      state,
      'integrations',
      integrationId,
      'connections'
    )
  );
  const isNotConnector = !(integration && integration._connectorId);
  const [tempId, setTempId] = useState(null);
  const newResourceId = useSelector(state =>
    selectors.createdResourceId(state, tempId)
  );

  useEffect(() => {
    if (newResourceId) {
      dispatch(
        actions.connection.requestRegister([newResourceId], integrationId)
      );
    }
  }, [dispatch, integrationId, newResourceId]);

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
        <Fragment>
          {isNotConnector && permission.create && (
            <IconTextButton
              onClick={() => {
                const newId = generateNewId();

                setTempId(newId);
                history.push(`${location.pathname}/add/connections/${newId}`);

                const patchSet = [
                  {
                    op: 'add',
                    path: '/_integrationId',
                    value: integrationId,
                  },
                ];

                dispatch(
                  actions.resource.patchStaged(newId, patchSet, 'value')
                );
              }}>
              <AddIcon /> Create connection
            </IconTextButton>
          )}
          {isNotConnector && permission.register && !isStandalone && (
            <IconTextButton onClick={() => setShowRegister(true)}>
              <ConnectionsIcon /> Register connections
            </IconTextButton>
          )}
        </Fragment>
      </PanelHeader>

      <LoadResources required resources="connections">
        <CeligoTable
          data={connections}
          filterKey={filterKey}
          {...metadata}
          actionProps={{ integrationId }}
        />
      </LoadResources>
    </div>
  );
}
