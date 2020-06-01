import { useRouteMatch, useHistory } from 'react-router-dom';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Button } from '@material-ui/core';
import actions from '../../actions';
import DynaSubmit from '../DynaForm/DynaSubmit';
import DynaForm from '../../components/DynaForm';

const useStyles = makeStyles(() => ({
  fieldContainer: {
    height: `calc(100vh - 202px)`,
  },
}));
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
  const classes = useStyles();
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

      if (!shareWithUserEmail) {
        return;
      }

      dispatch(actions.stack.inviteStackShareUser(shareWithUserEmail, stackId));
      // TODO: currently we are closing instantly. We need to close one success
      handleClose();
    },
    [dispatch, handleClose, stackId]
  );

  return (
    <DynaForm fieldMeta={fieldMeta} className={classes.fieldContainer}>
      <DynaSubmit
        data-test="saveInviteUser"
        id="saveInviteUser"
        onClick={handleInviteUser}>
        {`Invite user & close`}
      </DynaSubmit>
      <Button
        variant="text"
        color="primary"
        data-test="cancelInviteUser"
        label="Cancel"
        onClick={handleClose}>
        Cancel
      </Button>
    </DynaForm>
  );
}
