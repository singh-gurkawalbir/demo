import React, { useState, useMemo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { selectors } from '../../reducers';
import actions from '../../actions';
import LoadResources from '../LoadResources';
import CeligoTable from '../CeligoTable';
import metadata from './metadata';
import ModalDialog from '../ModalDialog';
import useSelectorMemo from '../../hooks/selectors/useSelectorMemo';
import {OutlinedButton, TextButton} from '../Buttons';

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

      dispatch(actions.resource.patchAndCommitStaged('flows', flow._id, patchSet));
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
      {hasFlows && (

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
      )}
      {hasFlows ? (
        <div>
          <OutlinedButton
            data-test="attachFlows"
            onClick={handleAttachFlowsClick}>
            Attach
          </OutlinedButton>
          <TextButton
            onClick={onClose}>
            Cancel
          </TextButton>
        </div>
      ) : <div>No flows found</div>}
    </ModalDialog>
  );
}
