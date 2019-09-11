import { Fragment, useState } from 'react';
import { useSelector } from 'react-redux';
import * as selectors from '../../reducers';
import LoadResources from '../../components/LoadResources';
import ResourceTable from '../ResourceList/ResourceTable';
import RegisterConnections from '../../components/RegisterConnections';
import CeligoIconButton from '../../components/IconButton';

function Connections(props) {
  const { match } = props;
  const { integrationId } = match.params;
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
          <CeligoIconButton
            onClick={() => setShowRegisterConnDialog(true)}
            variant="text">
            Register Connections
          </CeligoIconButton>
        )}

        <ResourceTable
          resourceType="connections"
          resources={list && list.resources}
        />
      </LoadResources>
    </Fragment>
  );
}

export default Connections;
