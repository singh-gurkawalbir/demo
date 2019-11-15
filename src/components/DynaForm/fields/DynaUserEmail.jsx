import { Fragment, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import { Button, TextField } from '@material-ui/core';
import ChangeEmail from '../../../views/MyAccount/ChangeEmail';
import actions from '../../../actions';

const useStyles = makeStyles(theme => ({
  textField: {
    flex: 1,
    width: '70%',
  },
  editRowElement: {
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'flex',
    justifyContent: 'flex-start' /* center horizontally */,
    alignItems: 'center' /* center vertically */,
    height: '50%',
    width: '70%',
  },
  emailField: {
    flexGrow: 4,
  },
  editEmailButton: {
    marginLeft: theme.spacing(1),
  },
}));

function DynaUserEmail(props) {
  const classes = useStyles();
  const [state, setState] = useState({
    openEmailModal: false,
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

  const { id, value, label } = props;

  return (
    <Fragment>
      <div className={classes.editRowElement}>
        <TextField
          id={id}
          label={label}
          type="email"
          margin="normal"
          value={value}
          className={classNames(classes.textField, classes.emailField)}
          disabled
          variant="filled"
        />
        <div>
          <Button
            data-test="editEmail"
            color="primary"
            variant="contained"
            className={classes.editEmailButton}
            onClick={() => handleOpenModal('openEmailModal')}>
            Edit Email
          </Button>
        </div>
      </div>
      <ChangeEmail
        show={state.openEmailModal}
        onhandleClose={() => handleCloseModal('openEmailModal')}
      />
    </Fragment>
  );
}

export default DynaUserEmail;
