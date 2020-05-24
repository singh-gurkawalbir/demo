import { Fragment, useCallback } from 'react';
import TextField from '@material-ui/core/TextField';
import { useSelector, useDispatch } from 'react-redux';
import {
  Button,
  Typography,
  makeStyles,
  FormControl,
  FormLabel,
} from '@material-ui/core';
import * as selectors from '../../reducers';
import actions from '../../actions';
import ModalDialog from '../../components/ModalDialog';
import FieldHelp from '../../components/DynaForm/FieldHelp';

const useStyles = makeStyles(() => ({
  textFormControl: {
    width: '100%',
  },
}));

export default function ChangeEmail(props) {
  const { show, onhandleClose } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const error = useSelector(state => selectors.changeEmailFailure(state));
  const success = useSelector(state => selectors.changeEmailSuccess(state));
  const message = useSelector(state => selectors.changeEmailMsg(state));
  const handleOnSubmit = useCallback(
    e => {
      e.preventDefault();
      const payload = {
        newEmail: e.target.newEmail.value,
        password: e.target.password.value,
      };

      dispatch(actions.auth.changeEmail(payload));
    },
    [dispatch]
  );

  return (
    <ModalDialog show={show} onClose={onhandleClose}>
      Change email
      {success ? (
        <Typography variant="body2">{message}</Typography>
      ) : (
        <div>
          <form id="changeEmailForm" onSubmit={handleOnSubmit}>
            <FormControl className={classes.textFormControl}>
              <div className={classes.dynaTextLabelWrapper}>
                <FormLabel htmlFor="newEmail" required>
                  New email
                </FormLabel>
                {/* <FieldHelp /> */}
              </div>
              <TextField id="newEmail" fullWidth required variant="filled" />
              <br />
            </FormControl>

            <FormControl className={classes.textFormControl}>
              <div className={classes.dynaTextLabelWrapper}>
                <FormLabel htmlFor="newEmail" required>
                  Password
                </FormLabel>
                {/* <FieldHelp /> */}
              </div>
              <TextField
                id="password"
                type="password"
                variant="filled"
                required
                fullWidth
              />
            </FormControl>
          </form>
          <Typography variant="body2">
            Note: we require your current password again to help safeguard your
            integrator.io account.
          </Typography>
        </div>
      )}
      {success ? (
        <span />
      ) : (
        <Fragment>
          {error && (
            <Typography variant="body2" component="span" color="error">
              {message}
            </Typography>
          )}

          <Button
            data-test="changeEmail"
            variant="outlined"
            color="primary"
            type="submit"
            form="changeEmailForm"
            value="Submit">
            Change email
          </Button>
        </Fragment>
      )}
    </ModalDialog>
  );
}
