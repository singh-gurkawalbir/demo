import { useState, Fragment, useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import shortid from 'shortid';
import { makeStyles } from '@material-ui/styles';
import RegisterConnections from '../../../../../../components/RegisterConnections';
import LoadResources from '../../../../../../components/LoadResources';
import CeligoTable from '../../../../../../components/CeligoTable';
import metadata from '../../../../../../components/ResourceTable/metadata/connections';
import * as selectors from '../../../../../../reducers';
import IconTextButton from '../../../../../../components/IconTextButton';
import AddIcon from '../../../../../../components/icons/AddIcon';
import ConnectionsIcon from '../../../../../../components/icons/ConnectionsIcon';
import PanelHeader from '../../../../../../components/PanelHeader';
import actions from '../../../../../../actions';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    overflowX: 'scroll',
  },
}));

export default function ConnectionsPanel({ integrationId, childId }) {
  const classes = useStyles();
  const [showRegister, setShowRegister] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const filterKey = `${integrationId}${`+${childId}` || ''}+connections`;
  const connections = useSelector(state =>
    selectors.integrationAppV2ConnectionList(state, integrationId, childId)
  );
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
          {permission.create && (
            <IconTextButton
              component={Link}
              to={`${
                location.pathname
              }/add/connections/new-${shortid.generate()}`}>
              <AddIcon /> Create connection
            </IconTextButton>
          )}
          {permission.register && (
            <IconTextButton onClick={() => setShowRegister(true)}>
              <ConnectionsIcon /> Register connections
            </IconTextButton>
          )}
        </Fragment>
      </PanelHeader>

      <LoadResources required resources="connections,flows,exports,imports">
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
