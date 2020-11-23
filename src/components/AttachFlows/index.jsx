import React, { useState, useMemo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { selectors } from '../../reducers';
import actions from '../../actions';
import LoadResources from '../LoadResources';
import CeligoTable from '../CeligoTable';
import metadata from './metadata';
import ModalDialog from '../ModalDialog';
import useSelectorMemo from '../../hooks/selectors/useSelectorMemo';

const flowsFilterConfig = { type: 'flows' };

export default function AttachFlows({ onClose, integrationId }) {
  const allFlows = useSelectorMemo(
    selectors.makeResourceListSelector,
    flowsFilterConfig
  ).resources;
  const flows = useMemo(() => allFlows.filter(f => !f._integrationId), [
    allFlows,
  ]);
  const hasFlows = !!flows.length;
  const [selected, setSelected] = useState([]);
  const handleSelectChange = flows => {
    const selectedFlows = [];

    Object.entries(flows).forEach(([key, value]) => {
      if (value) {
        selectedFlows.push(key);
      }
    });
    setSelected(selectedFlows);
  };
  const dispatch = useDispatch();
  const connectionIdsToRegister = useSelectorMemo(selectors.mkConnectionIdsUsedInSelectedFlows, selected);
  const handleAttachFlowsClick = useCallback(() => {
    const selectedFlows =
      flows && flows.filter(f => selected.indexOf(f._id) > -1);

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
        connectionIdsToRegister,
        integrationId
      )
    );
    onClose();
  }, [
    connectionIdsToRegister,
    dispatch,
    flows,
    integrationId,
    onClose,
    selected,
  ]);

  return (
    <ModalDialog show maxWidth={false} onClose={onClose}>
      <div>Attach flows</div>
      {hasFlows ? (
        <>
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
            <Button
              variant="text"
              color="primary"
              onClick={onClose}>
              Cancel
            </Button>
          </div>
        </>
      ) : <div>No flows found</div>}
    </ModalDialog>
  );
}
