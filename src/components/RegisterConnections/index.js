import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FilledButton } from '@celigo/fuse-ui';
import actions from '../../actions';
import LoadResources from '../LoadResources';
import CeligoTable from '../CeligoTable';
import { selectors } from '../../reducers';
import metadata from './metadata';
import ModalDialog from '../ModalDialog';
import customCloneDeep from '../../utils/customCloneDeep';

export default function RegisterConnections({ onClose, integrationId }) {
  const tableConfig = useSelector(state => selectors.filter(state, 'registerConnections'));
  const connectionsToReg = useSelector(state =>
    selectors.availableConnectionsToRegister(state, integrationId, tableConfig)
  );
  const [selected, setSelected] = useState({});
  const dispatch = useDispatch();
  const handleSelectChange = connections => {
    setSelected(connections);
  };

  const handleRegisterClick = () => {
    const connectionIds = Object.keys(selected).filter(
      key => selected[key] === true
    );

    dispatch(actions.connection.requestRegister(connectionIds, integrationId));
    onClose();
  };

  return (
    <ModalDialog
      show
      onClose={onClose}
      data-test="closeRegisterConnectionsDialog"
      maxWidth="xl">
      <div>Register connections</div>
      <div>
        <LoadResources required resources="connections">
          <CeligoTable
            filterKey="registerConnections"
            actionProps={{ onClose }}
            data={customCloneDeep(connectionsToReg)}
            onSelectChange={handleSelectChange}
            {...metadata}
            selectableRows
          />
        </LoadResources>
      </div>
      <div>
        <FilledButton
          data-test="registerConnections"
          onClick={handleRegisterClick}
          >
          Register
        </FilledButton>
      </div>
    </ModalDialog>
  );
}
