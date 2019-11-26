import { useState, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import shortid from 'shortid';
import { makeStyles } from '@material-ui/styles';
import RegisterConnections from '../../../../../components/RegisterConnections';
import LoadResources from '../../../../../components/LoadResources';
import CeligoTable from '../../../../../components/CeligoTable';
import metadata from '../../../../../components/ResourceTable/metadata/connections';
import * as selectors from '../../../../../reducers';
import IconTextButton from '../../../../../components/IconTextButton';
import AddIcon from '../../../../../components/icons/AddIcon';
import ConnectionsIcon from '../../../../../components/icons/ConnectionsIcon';
import PanelHeader from '../../../common/PanelHeader';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
  },
}));

export default function ConnectionsPanel({ integrationId, storeId }) {
  const classes = useStyles();
  const [showRegister, setShowRegister] = useState(false);
  const location = useLocation();
  const connections = useSelector(state =>
    selectors.integrationAppConnectionList(state, integrationId, storeId)
  );
  // TODO: All this logic should go into a single selector called "canManageConnections",
  // or some equivalent name. This would also reduce the complexity of managing
  // performance since the selector would only return a scalar (bool) so React would
  // easily recognize when not to re-render instead of this component containing this
  // state  inspection manipulation logic. Also a component developer should not be responsible
  // to understand/maintain this complex logic.
  const integration = useSelector(state =>
    selectors.resource(state, 'integrations', integrationId)
  );
  const permissions = useSelector(state => selectors.userPermissions(state));
  const accountAccessLevel = permissions.accessLevel;
  const integrationAccessLevel =
    permissions.integrations &&
    permissions.integrations[integrationId] &&
    permissions.integrations[integrationId].accessLevel;
  const writePermissions =
    accountAccessLevel === 'manage' ||
    accountAccessLevel === 'owner' ||
    integrationAccessLevel !== 'monitor';
  const canManageConnections =
    integrationId &&
    integrationId !== 'none' &&
    !(integration && integration._connectorId) &&
    writePermissions;
  // all the above logic should be replaced by a single selector.

  return (
    <div className={classes.root}>
      {showRegister && (
        <RegisterConnections
          integrationId={integrationId}
          onClose={() => setShowRegister(false)}
        />
      )}

      <PanelHeader title="Connections">
        {canManageConnections && (
          <Fragment>
            <IconTextButton
              component={Link}
              to={`${
                location.pathname
              }/add/connections/new-${shortid.generate()}`}>
              <AddIcon /> Create connection
            </IconTextButton>
            <IconTextButton onClick={() => setShowRegister(true)}>
              <ConnectionsIcon /> Register connections
            </IconTextButton>
          </Fragment>
        )}
      </PanelHeader>

      <LoadResources required resources="connections">
        <CeligoTable
          data={connections}
          {...metadata}
          actionProps={{ integrationId }}
        />
      </LoadResources>
    </div>
  );
}
