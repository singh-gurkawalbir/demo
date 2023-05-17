import { useSelector, useDispatch } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import React, {useCallback, useEffect} from 'react';
import { TextButton } from '@celigo/fuse-ui';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import useFormInitWithPermissions from '../../../../hooks/useFormInitWithPermissions';
import { getReplaceConnectionExpression } from '../../../../utils/connections';
import DynaForm from '../../../../components/DynaForm';
import DynaSubmit from '../../../../components/DynaForm/DynaSubmit';
import ResourceDrawer from '../../../../components/drawer/Resource';
import useConfirmDialog from '../../../../components/ConfirmDialog';
import DrawerContent from '../../../../components/drawer/Right/DrawerContent';
import DrawerFooter from '../../../../components/drawer/Right/DrawerFooter';
import ActionGroup from '../../../../components/ActionGroup';
import { message } from '../../../../utils/messageStore';

const emptyObj = {};

export default function ReplaceConnection(props) {
  const match = useRouteMatch();
  const { confirmDialog } = useConfirmDialog();
  const dispatch = useDispatch();
  const { onClose, flowId, integrationId, childId, setConnName } = props;
  const isFrameWork2 = useSelector(state => selectors.isIntegrationAppVersion2(state, integrationId, true));

  const { connId } = match.params;
  const connection = useSelector(
    state =>
      selectors.resource(state, 'connections', connId) ||
      emptyObj
  );

  const options = getReplaceConnectionExpression(connection, isFrameWork2, childId, integrationId, connection?._connectorId, true);

  useEffect(() => {
    setConnName(connection?.name);
  }, [connection, setConnName]);

  const fieldMeta = {
    fieldMap: {
      _connectionId: {
        id: '_connectionId',
        name: '_connectionId',
        type: 'selectresource',
        resourceType: 'connections',
        label: 'Connection',
        allowEdit: true,
        allowNew: true,
        skipPingConnection: true,
        options,
        integrationId,
        required: true,
      },
    },
  };

  const formKey = useFormInitWithPermissions({ fieldMeta });

  const replace = useCallback(formVal => {
    confirmDialog({
      title: 'Confirm replace',
      message: message.CONNECTION.CONFIRM_REPLACE_CONNECTION,
      buttons: [
        {
          label: 'Replace',
          onClick: () => {
            dispatch(actions.resource.replaceConnection('flows', flowId, connection._id, formVal._connectionId));
            onClose();
          },
        },
        {
          label: 'Cancel',
          variant: 'text',
        },
      ],
    });
  }, [dispatch, flowId, connection._id, confirmDialog, onClose]);

  return (
    <>
      <DrawerContent>
        <DynaForm formKey={formKey} />
      </DrawerContent>
      <DrawerFooter>
        <ActionGroup>
          <DynaSubmit
            formKey={formKey}
            onClick={replace}
            color="primary"
            disabled={false}
            data-test="replaceConnection">
            Replace
          </DynaSubmit>
          <TextButton onClick={onClose}>
            Cancel
          </TextButton>
        </ActionGroup>
      </DrawerFooter>
      <ResourceDrawer />
    </>
  );
}
