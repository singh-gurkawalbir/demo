import { Fragment, useState } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { useHistory, Link } from 'react-router-dom';
import shortid from 'shortid';
import * as selectors from '../../reducers';
import LoadResources from '../../components/LoadResources';
import CeligoTable from '../../components/CeligoTable';
import RegisterConnections from '../../components/RegisterConnections';
import metadata from '../../components/ResourceTable/metadata/connections';
import ResourceDrawer from '../../components/drawer/Resource';
import IconTextButton from '../../components/IconTextButton';
import AddIcon from '../../components/icons/AddIcon';

const useStyles = makeStyles(() => ({
  registerButton: {
    float: 'right',
  },
}));

export default function Connections(props) {
  const { match, storeId } = props;
  const { integrationId } = match.params;
  const classes = useStyles();
  const [showRegisterConnDialog, setShowRegisterConnDialog] = useState(false);
  const connections = useSelector(state => {
    if (storeId) {
      return selectors.integrationAppConnectionList(
        state,
        integrationId,
        storeId
      );
    }

    return selectors.integrationConnectionList(state, integrationId);
  });
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
  const history = useHistory();

  return (
    <Fragment>
      <ResourceDrawer {...props} />
      {showRegisterConnDialog && (
        <RegisterConnections
          integrationId={integrationId}
          onClose={() => setShowRegisterConnDialog(false)}
        />
      )}
      <LoadResources required resources="connections">
        {integrationId &&
          integrationId !== 'none' &&
          !(integration && integration._connectorId) &&
          writePermissions && (
            <IconTextButton
              data-test="addNewResource"
              component={Link}
              to={`${
                history.location.pathname
              }/add/connections/new-${shortid.generate()}`}
              variant="text"
              color="primary">
              <AddIcon /> New Connection
            </IconTextButton>
          )}
        {integrationId &&
          integrationId !== 'none' &&
          !(integration && integration._connectorId) &&
          writePermissions && (
            <Button
              className={classes.registerButton}
              onClick={() => setShowRegisterConnDialog(true)}>
              Register Connections
            </Button>
          )}
        <CeligoTable
          resourceType="connections"
          data={connections}
          {...metadata}
          actionProps={{ integrationId }}
        />
      </LoadResources>
    </Fragment>
  );
}
