import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typography, makeStyles } from '@material-ui/core';
import * as selectors from '../../reducers';
import actions from '../../actions';
import ModalDialog from '../../components/ModalDialog';
import NotificationToaster from '../../components/NotificationToaster';
import DynaForm from '../../components/DynaForm';
import DynaSubmit from '../../components/DynaForm/DynaSubmit';

const useStyles = makeStyles(theme => ({
  container: {
    padding: 10,
    backgroundColor: theme.palette.background.default,
    overflowY: 'auto',
    height: '100%',
    width: '100%',
    '& > div:first-child': {
      flexDirection: 'column',
    },
  },
}));
const changeEmailFieldMeta = {
  fieldMap: {
    newEmail: {
      id: 'newEmail',
      name: 'newEmail',
      type: 'text',
      label: 'New email',
      required: true,
    },
    password: {
      id: 'password',
      name: 'password',
      type: 'text',
      inputType: 'password',
      label: 'Password',
      required: true,
    },
    label: {
      id: 'label',
      name: 'label',
      type: 'labeltitle',
      label:
        'Note: we require your current password again to help safeguard your integrator.io account.',
    },
  },
  layout: {
    fields: ['newEmail', 'password', 'label'],
  },
};

export default function ChangeEmail(props) {
  const { show, onhandleClose } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const error = useSelector(state => selectors.changeEmailFailure(state));
  const success = useSelector(state => selectors.changeEmailSuccess(state));
  const message = useSelector(state => selectors.changeEmailMsg(state));
  const handleOnSubmit = useCallback(
    formVal => {
      const payload = {
        newEmail: formVal.newEmail,
        password: formVal.password,
      };

      dispatch(actions.auth.changeEmail(payload));
    },
    [dispatch]
  );

  return (
    <ModalDialog show={show} onClose={onhandleClose}>
      Change email
      {error && (
        <NotificationToaster variant="error" size="large">
          <Typography variant="h6">{message}</Typography>
        </NotificationToaster>
      )}
      {success ? (
        <NotificationToaster variant="success" size="large">
          <Typography variant="h6">{message}</Typography>
        </NotificationToaster>
      ) : (
        <div className={classes.container}>
          <DynaForm fieldMeta={changeEmailFieldMeta}>
            <DynaSubmit
              data-test="changeEmail"
              id="changeEmail"
              onClick={handleOnSubmit}>
              Change email
            </DynaSubmit>
          </DynaForm>
        </div>
      )}
    </ModalDialog>
  );
}
