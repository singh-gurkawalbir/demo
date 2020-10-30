import { useRouteMatch, useHistory } from 'react-router-dom';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@material-ui/core';
import actions from '../../actions';
import useFormInitWithPermissions from '../../hooks/useFormInitWithPermissions';
import DrawerContent from '../drawer/Right/DrawerContent';
import DrawerFooter from '../drawer/Right/DrawerFooter';
import DynaSubmit from '../DynaForm/DynaSubmit';
import DynaForm from '../DynaForm';
import ButtonGroup from '../ButtonGroup';

const fieldMeta = {
  fieldMap: {
    email: {
      id: 'email',
      name: 'email',
      type: 'text',
      label: 'Email',
      required: true,
    },
  },
  layout: {
    fields: ['email'],
  },
};

export default function InviteUser() {
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const { stackId } = match.params;
  const history = useHistory();
  const handleClose = useCallback(() => {
    history.goBack();
  }, [history]);
  const handleInviteUser = useCallback(
    formVal => {
      const shareWithUserEmail = formVal.email;

      if (!shareWithUserEmail) return;

      dispatch(actions.stack.inviteStackShareUser(shareWithUserEmail, stackId));
      // TODO: currently we are closing instantly. We need to close one success
      handleClose();
    },
    [dispatch, handleClose, stackId]
  );

  const formKey = useFormInitWithPermissions({

    fieldMeta,
  });

  return (
    <>
      <DrawerContent>
        <DynaForm
          formKey={formKey}
          fieldMeta={fieldMeta} />
      </DrawerContent>

      <DrawerFooter>
        <ButtonGroup>
          <DynaSubmit
            formKey={formKey}
            data-test="saveInviteUser"
            id="saveInviteUser"
            onClick={handleInviteUser}>
            Invite user & close
          </DynaSubmit>
          <Button
            variant="text"
            color="primary"
            data-test="cancelInviteUser"
            label="Cancel"
            onClick={handleClose}>
            Cancel
          </Button>
        </ButtonGroup>
      </DrawerFooter>
    </>
  );
}
