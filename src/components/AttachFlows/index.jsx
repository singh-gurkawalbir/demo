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
import { UNASSIGNED_SECTION_ID } from '../../utils/constants';

const flowsFilterConfig = { type: 'flows' };

export default function AttachFlows({ integrationId, flowGroupingId }) {
  const allFlows = useSelectorMemo(
    selectors.makeResourceListSelector,
    flowsFilterConfig
  ).resources;
  const flows = useMemo(() => allFlows.filter(f => !f._integrationId), [
    allFlows,
  ]);
  const hasFlows = !!flows.length;
  const [selected, setSelected] = useState([]);
  const [showDialog, setShowDialog] = useState(true);
  const toggleDialog = useCallback(() => {
    setShowDialog(!showDialog);
  }, [showDialog]);
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

      if (flowGroupingId && flowGroupingId !== UNASSIGNED_SECTION_ID) {
        patchSet.push({
          op: 'add',
          path: '/_flowGroupingId',
          value: flowGroupingId,
        });
      }

      dispatch(actions.resource.patchStaged(flow._id, patchSet, 'value'));
      dispatch(actions.resource.commitStaged('flows', flow._id, 'value'));
    });

    dispatch(
      actions.connection.requestRegister(
        connectionIdsToRegister,
        integrationId
      )
    );
    toggleDialog();
  }, [
    connectionIdsToRegister,
    dispatch,
    flows,
    integrationId,
    toggleDialog,
    selected,
    flowGroupingId,
  ]);

  return (
    <>
      {showDialog && (
        <ModalDialog show maxWidth={false} onClose={toggleDialog}>
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
                onClick={toggleDialog}>
                Cancel
              </TextButton>
            </div>
          ) : <div>No flows found</div>}
        </ModalDialog>
      )}
    </>
  );
}
