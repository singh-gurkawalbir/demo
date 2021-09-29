/* eslint-disable react/jsx-handler-names */
import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import DynaForm from '../../../../../../components/DynaForm';
import DynaSubmit from '../../../../../../components/DynaForm/DynaSubmit';
import actions from '../../../../../../actions';
import RightDrawer from '../../../../../../components/drawer/Right';
import DrawerHeader from '../../../../../../components/drawer/Right/DrawerHeader';
import DrawerContent from '../../../../../../components/drawer/Right/DrawerContent';
import DrawerFooter from '../../../../../../components/drawer/Right/DrawerFooter';
import { selectors } from '../../../../../../reducers';
import ResourceSetupDrawer from '../../../../../../components/ResourceSetup';
import { generateNewId } from '../../../../../../utils/resource';
import jsonUtil from '../../../../../../utils/json';
import { SCOPES } from '../../../../../../sagas/resourceForm';
import useConfirmDialog from '../../../../../../components/ConfirmDialog';
import useFormInitWithPermissions from '../../../../../../hooks/useFormInitWithPermissions';
import TextButton from '../../../../../../components/Buttons/TextButton';
import ActionGroup from '../../../../../../components/ActionGroup';

export default function ConnectionDrawer({
  connectorId,
  handleSubmitComplete,
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
      },
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
    dispatch(
      actions.suiteScript.installer.updateStep(
        connectorId,
        'reset'
      )
    );
    history.goBack();
  }, [connectorId, dispatch, history]);

  const handleDrawerClose = useCallback(() => {
    dispatch(
      actions.suiteScript.installer.updateStep(
        connectorId,
        'reset'
      )
    );
    history.goBack();
  }, [connectorId, dispatch, history]);

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
          },
        ],
      });
      setConnection(null);
      setAccount(null);
    }
  }, [account, confirmDialog, handleConnectionSubmit, linkedConnectionId, linkedConnectionName]);
  const formKey = useFormInitWithPermissions({
    fieldMeta,
  });

  return (
    <>
      <RightDrawer
        path="setConnection"
        height="tall"
        width="medium"
        onClose={handleDrawerClose}>
        <DrawerHeader
          title="Please provide NetSuite account ID"
          infoText="This is used to verify if there is an existing connection already linked to NetSuite."
      />
        <DrawerContent>
          <DynaForm formKey={formKey} />
        </DrawerContent>

        <DrawerFooter>
          <ActionGroup>
            <DynaSubmit
              formKey={formKey}
              onClick={handleAccountSubmit}
              color="primary"
              variant="outlined">
              Continue
            </DynaSubmit>
            <TextButton onClick={handleDrawerClose}>
              Cancel
            </TextButton>
          </ActionGroup>
        </DrawerFooter>
      </RightDrawer>
      {connection && (
        <ResourceSetupDrawer
          resourceId={connection.newId}
          resource={connection.doc}
          resourceType="connections"
          onClose={handleConnectionClose}
          onSubmitComplete={handleSubmitComplete}
          manageOnly
          addOrSelect
          />
      )}
    </>
  );
}
