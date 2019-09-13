import { Fragment, useState } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import * as selectors from '../../reducers';
import LoadResources from '../../components/LoadResources';
import ResourceTable from '../ResourceList/ResourceTable';
import RegisterConnections from '../../components/RegisterConnections';

const useStyles = makeStyles(() => ({
  registerButton: {
    float: 'right',
  },
}));

export default function Connections(props) {
  const { match } = props;
  const { integrationId } = match.params;
  const classes = useStyles();
  const [showRegisterConnDialog, setShowRegisterConnDialog] = useState(false);
  const list = useSelector(state =>
    selectors.integrationConnectionList(state, integrationId)
  );
  const permissions = useSelector(state => selectors.userPermissions(state));
  const accountAccessLevel = permissions.accessLevel;
  const integrationAccessLevel =
    permissions.integrations &&
    permissions.integrations[integrationId] &&
    permissions.integrations[integrationId].accessLevel;
  const showRegisterButton =
    accountAccessLevel === 'manage' ||
    accountAccessLevel === 'owner' ||
    integrationAccessLevel !== 'monitor';

  return (
    <Fragment>
      {showRegisterConnDialog && (
        <RegisterConnections
          integrationId={integrationId}
          onClose={() => setShowRegisterConnDialog(false)}
        />
      )}
      <LoadResources required resources="connections">
        {integrationId && integrationId !== 'none' && showRegisterButton && (
          <Button
            className={classes.registerButton}
            onClick={() => setShowRegisterConnDialog(true)}>
            Register Connections
          </Button>
        )}

        <ResourceTable
          resourceType="connections"
          resources={list && list.resources}
        />
      </LoadResources>
    </Fragment>
  );
}
