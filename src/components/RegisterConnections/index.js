import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import actions from '../../actions';
import LoadResources from '../../components/LoadResources';
import CeligoTable from '../../components/CeligoTable';
import * as selectors from '../../reducers';
import metadata from './metadata';
import ModalDialog from '../../components/ModalDialog';

export default function RegisterConnections({ onClose, integrationId }) {
  const connectionsToReg = useSelector(state =>
    selectors.availableConnectionsToRegister(state, integrationId)
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
      handleClose={onClose}
      data-test="closeRegisterConnectionsDialog"
      width="lg">
      <div>Register Connections</div>
      <div>
        <LoadResources required resources="connections">
          <CeligoTable
            data={connectionsToReg}
            onSelectChange={handleSelectChange}
            {...metadata}
            selectableRows
          />
        </LoadResources>
      </div>
      <div>
        <Button
          data-test="registerConnections"
          onClick={handleRegisterClick}
          variant="outlined"
          color="primary">
          Register
        </Button>
      </div>
    </ModalDialog>
  );
}
