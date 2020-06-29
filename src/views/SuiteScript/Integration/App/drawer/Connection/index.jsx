/* eslint-disable react/jsx-handler-names */
import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import DynaForm from '../../../../../../components/DynaForm';
import DynaSubmit from '../../../../../../components/DynaForm/DynaSubmit';
import actions from '../../../../../../actions';
import RightDrawer from '../../../../../../components/drawer/Right';
import * as selectors from '../../../../../../reducers';
import ResourceSetupDrawer from '../../../../../../components/ResourceSetup';
import {
  generateNewId,
} from '../../../../../../utils/resource';
import jsonUtil from '../../../../../../utils/json';
import { SCOPES } from '../../../../../../sagas/resourceForm';
import useConfirmDialog from '../../../../../../components/ConfirmDialog';

export default function ConnectionDrawer({
  handleSubmitComplete
}) {
  const dispatch = useDispatch();
  const { confirmDialog } = useConfirmDialog();
  const [connection, setConnection] = useState(null);
  const [account, setAccount] = useState(null);
  const history = useHistory();

  const linkedConnectionId = useSelector(state => selectors.suiteScriptIntegratorLinkedConnectionId(state, account));
  const linkedConnectionName = useSelector(state => {
    const r = selectors.resource(state, 'connections', linkedConnectionId);
    return r?.name;
  });

  const fieldMeta = useMemo(
    () => ({
      fieldMap: {
        account: {
          id: 'account',
          name: 'account',
          type: 'text',
          label: 'Account ID',
          uppercase: true,
          required: true,
        },
      }
    }),
    []
  );

  const handleAccountSubmit = useCallback(
    formVal => {
      setAccount(formVal.account);
    },
    []
  );

  const handleConnectionClose = useCallback(() => {
    setConnection(null);
    setAccount(null);
    history.goBack();
  }, [history]);

  const handleConnectionSubmit = useCallback(() => {
    handleSubmitComplete(linkedConnectionId);
  }, [handleSubmitComplete, linkedConnectionId]);

  useEffect(() => {
    if (account && !linkedConnectionId) {
      const newId = generateNewId();
      const conn = {
        type: 'netsuite',
        netsuite: { type: 'netsuite'},
      };

      dispatch(
        actions.resource.patchStaged(
          newId,
          jsonUtil.objectToPatchSet(conn),
          SCOPES.VALUE
        )
      );
      setConnection({
        newId,
        doc: conn,
      });
      setAccount(null);
    }
  }, [account, dispatch, linkedConnectionId]);

  useEffect(() => {
    if (account && linkedConnectionId) {
      confirmDialog({
        title: 'Confirm connection',
        message: `There is already a linked connection for this account, '${linkedConnectionName}'. Please confirm to proceed with this connection or go back to change the account id.`,
        buttons: [
          {
            label: 'Yes, confirm',
            onClick: handleConnectionSubmit,
          },
          {
            label: 'No, go back',
            color: 'secondary',
          }
        ],
      });
      setConnection(null);
      setAccount(null);
    }
  }, [account, confirmDialog, handleConnectionSubmit, linkedConnectionId, linkedConnectionName]);

  return (
    <RightDrawer
      path="setConnection"
      title="Please provide NetSuite account ID"
      infoText="This is used to verify if there is an existing connection already linked to NetSuite."
      height="tall"
      width="medium"
      onClose={history.goBack}>
      <div >
        <DynaForm
          fieldMeta={fieldMeta}
          render>
          <DynaSubmit
            onClick={handleAccountSubmit}
            color="primary"
            variant="outlined">
            Continue
          </DynaSubmit>
          <Button onClick={history.goBack} variant="text" color="primary">
            Cancel
          </Button>
        </DynaForm>
        {connection && <ResourceSetupDrawer
          resourceId={connection.newId}
          resource={connection.doc}
          resourceType="connections"
          onClose={handleConnectionClose}
          onSubmitComplete={handleSubmitComplete}
          manageOnly
          addOrSelect
          />}
      </div>
    </RightDrawer>
  );
}
