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

  return (
    <Fragment>
      {showRegisterConnDialog && (
        <RegisterConnections
          integrationId={integrationId}
          onClose={() => setShowRegisterConnDialog(false)}
        />
      )}
      <LoadResources required resources="connections">
        {integrationId && integrationId !== 'none' && (
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
