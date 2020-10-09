import Button from '@material-ui/core/Button';
import { useSelector, useDispatch } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import React, {useCallback} from 'react';
import { selectors } from '../../reducers';
import DynaForm from '../DynaForm';
import DynaSubmit from '../DynaForm/DynaSubmit';
import ButtonGroup from '../ButtonGroup';
import actions from '../../actions';
import useFormInitWithPermissions from '../../hooks/useFormInitWithPermissions';
import { RDBMS_TYPES } from '../../utils/constants';
import ResourceDrawer from '../drawer/Resource';
import useConfirmDialog from '../ConfirmDialog';

const emptyObj = {};

export default function ReplaceConnection(props) {
  const match = useRouteMatch();
  const { confirmDialog } = useConfirmDialog();
  const dispatch = useDispatch();
  const { onClose, flowId, integrationId, childId } = props;
  const isFrameWork2 = useSelector(state => selectors.isIntegrationAppVersion2(state, integrationId, true));

  const { connId } = match.params;
  const connection = useSelector(
    state =>
      selectors.resource(state, 'connections', connId) ||
      emptyObj
  );

  let options = {};
  const expression = [];
  const integratorExpression = [];

  expression.push({ _id: {$ne: connection._id} });

  if (RDBMS_TYPES.includes(connection.type)) {
    expression.push({ 'rdbms.type': connection.type });
  } else {
    expression.push({ type: connection.type });
  }

  if (connection._connectorId) {
    expression.push({ _connectorId: connection._connectorId});
    if (isFrameWork2 && childId) {
      integratorExpression.push({ _integrationId: integrationId});
      integratorExpression.push({ _integrationId: childId});
      expression.push({ $or: integratorExpression });
    } else { expression.push({ _integrationId: integrationId}); }
  } else {
    expression.push({ _connectorId: { $exists: false } });
  }

  if (connection.assistant) {
    expression.push({ assistant: connection.assistant });

    const andingExpressions = { $and: expression };

    options = { filter: andingExpressions, appType: connection.assistant };
  } else {
    const andingExpressions = { $and: expression };

    options = { filter: andingExpressions, appType: connection.type };
  }

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
    layout: {
      fields: ['_connectionId'],
    },
  };

  const formKey = useFormInitWithPermissions({
    fieldMeta,
    optionsHandler: fieldMeta.optionsHandler,
  });

  const replace = useCallback(formVal => {
    confirmDialog({
      title: 'Confirm replace',
      message: 'Are you sure you want to replace the connection for this flow? Replacing a connection will cancel all jobs currently running.',
      buttons: [
        {
          label: 'Replace',
          onClick: () => {
            dispatch(actions.resource.replaceConnection(flowId, connection._id, formVal._connectionId));
            onClose();
          },
        },
        {
          label: 'Cancel',
          color: 'secondary',
        },
      ],
    });
  }, [dispatch, flowId, connection._id, confirmDialog]);

  return (
    <div>
      <DynaForm
        formKey={formKey}
        fieldMeta={fieldMeta} />
      <ButtonGroup>
        <DynaSubmit
          formKey={formKey}
          onClick={replace}
          color="primary"
          disabled={false}
          data-test="replaceConnection">
          Replace & close
        </DynaSubmit>
        <Button onClick={onClose} variant="text" color="primary">
          Cancel
        </Button>
      </ButtonGroup>
      <ResourceDrawer />
    </div>
  );
}
