import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import * as selectors from '../../reducers';
import actions from '../../actions';
import LoadResources from '../LoadResources';
import CeligoTable from '../CeligoTable';
import metadata from './metadata';
import ModalDialog from '../ModalDialog';

export default function AttachFlows({ onClose, integrationId }) {
  const flows = useSelector(state =>
    selectors
      .resourceList(state, { type: 'flows' })
      .resources.filter(f => !f._integrationId)
  );
  const [selected, setSelected] = useState({});
  const handleSelectChange = flows => {
    setSelected(flows);
  };

  const dispatch = useDispatch();
  const connectionIdsToRegister = useSelector(state => selectedFlowIds =>
    selectors.getAllConnectionIdsUsedInSelectedFlows(state, selectedFlowIds)
  );
  const handleAttachFlowsClick = () => {
    const flowIds = Object.keys(selected).filter(key => selected[key] === true);
    const selectedFlows =
      flows && flows.filter(f => flowIds.indexOf(f._id) > -1);

    if (!selectedFlows) return;
    selectedFlows.forEach(flow => {
      const patchSet = [
        {
          op: 'replace',
          path: '/_integrationId',
          value: integrationId,
        },
      ];

      dispatch(actions.resource.patchStaged(flow._id, patchSet, 'value'));
      dispatch(actions.resource.commitStaged('flows', flow._id, 'value'));
    });

    dispatch(
      actions.connection.requestRegister(
        connectionIdsToRegister(selectedFlows),
        integrationId
      )
    );
    onClose();
  };

  return (
    <ModalDialog show maxWidth={false} onClose={onClose}>
      <div>Attach Flows</div>
      <div>
        <LoadResources
          required
          resources="flows, connections, exports, imports">
          <CeligoTable
            data={flows}
            onSelectChange={handleSelectChange}
            {...metadata}
            selectableRows
          />
        </LoadResources>
      </div>
      <div>
        <Button
          data-test="attachFlows"
          onClick={handleAttachFlowsClick}
          variant="outlined"
          color="primary">
          Attach
        </Button>
      </div>
    </ModalDialog>
  );
}
