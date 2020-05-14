import { Fragment, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import { Button, InputLabel } from '@material-ui/core';
import ChangePassword from '../../../views/MyAccount/ChangePassword';
import actions from '../../../actions';

const useStyles = makeStyles(theme => ({
  editRowElement: {
    margin: `0 !important`,
    display: 'flex',
    flexDirection: `row !important`,
    justifyContent: 'flex-start' /* center horizontally */,
    alignItems: 'center' /* center vertically */,
    height: '50%',
    width: '70%',
    marginBottom: 6,
  },
  btnPassword: {
    marginLeft: theme.spacing(1),
  },
}));

function DynaUserPassword() {
  const classes = useStyles();
  const [state, setState] = useState({
    openPasswordModal: false,
  });
  const dispatch = useDispatch();
  const clearComms = () => dispatch(actions.clearComms());
  const handleOpenModal = modalKey => {
    clearComms();
    setState({ ...state, [modalKey]: true });
  };

  const handleCloseModal = modalKey => {
    setState({ ...state, [modalKey]: false });
  };

  return (
    <Fragment>
      <InputLabel>
        Password:
        <Button
          data-test="editPassword"
          color="secondary"
          className={classes.btnPassword}
          variant="outlined"
          onClick={() => handleOpenModal('openPasswordModal')}>
          Edit password
        </Button>
      </InputLabel>

      <ChangePassword
        show={state.openPasswordModal}
        onhandleClose={() => handleCloseModal('openPasswordModal')}
      />
    </Fragment>
  );
}

export default DynaUserPassword;
